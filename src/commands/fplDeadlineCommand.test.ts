import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FplDeadlineCommand } from './fplDeadlineCommand';
import { CommandContext } from '../types';

// Define minimal interfaces matching Playwright's Browser and Page
interface MockPage {
  goto: (url: string, options?: any) => Promise<void>;
  locator: (selector: string) => {
    textContent: () => Promise<string | null>;
  };
}

interface MockBrowser {
  newPage: () => Promise<MockPage>;
  close: () => Promise<void>;
}

// Mock playwright
vi.mock('playwright', async () => {
  const actual = await vi.importActual('playwright');

  const mockLocator = {
    textContent: vi.fn(),
  };

  const mockPage: MockPage = {
    goto: vi.fn().mockResolvedValue(undefined),
    locator: vi.fn().mockReturnValue(mockLocator),
  };

  const mockBrowser: MockBrowser = {
    newPage: vi.fn().mockResolvedValue(mockPage),
    close: vi.fn().mockResolvedValue(undefined),
  };

  const chromium = {
    launch: vi.fn().mockResolvedValue(mockBrowser),
  };

  return {
    ...(actual as any), // Fallback to actual implementation if needed
    chromium,
  };
});

// Import chromium after mocking
import { chromium } from 'playwright';

describe('FplDeadlineCommand', () => {
  let command: FplDeadlineCommand;
  let mockContext: CommandContext;

  beforeEach(() => {
    command = new FplDeadlineCommand();
    mockContext = {
      message: {
        reply: vi.fn().mockResolvedValue(undefined), // Mock the reply function
      },
      args: [],
      member: undefined,
      channel: undefined,
    } as unknown as CommandContext; // Casting to bypass strict typing for the mock
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and format the FPL deadline correctly', async () => {
    const mockDateText = 'fri 4 sept, 18:30 bst';

    // Access the mocked Playwright functions
    const launchMock = vi.mocked(chromium.launch);
    const mockPage_goto = vi.fn().mockResolvedValue(undefined);
    const mockLocator_textContent = vi.fn().mockResolvedValue(mockDateText);
    const mockPage_locator = vi.fn().mockReturnValue({ textContent: mockLocator_textContent });
    const mockBrowser_newPage = vi.fn().mockResolvedValue({ goto: mockPage_goto, locator: mockPage_locator });
    const mockBrowser_close = vi.fn().mockResolvedValue(undefined);
    const mockBrowser = {
        newPage: mockBrowser_newPage,
        close: mockBrowser_close,
    };

    launchMock.mockResolvedValue(mockBrowser);

    await command.execute(mockContext);

    // Verify Playwright was launched and used
    expect(launchMock).toHaveBeenCalledWith({ headless: true });
    expect(mockPage_goto).toHaveBeenCalledWith('https://onsidearena.com/deadline', { waitUntil: 'networkidle' });
    expect(mockPage_locator).toHaveBeenCalledWith('.deadline .date');
    expect(mockLocator_textContent).toHaveBeenCalled();
    expect(mockBrowser_close).toHaveBeenCalled();

    // Verify the message was sent with the correct format
    expect(mockContext.message.reply).toHaveBeenCalledTimes(1);
    const calledWithArg = vi.mocked(mockContext.message.reply).mock.calls[0][0];
    expect(calledWithArg).toContain('The next FPL deadline is:');
    expect(calledWithArg).toContain('<t:'); // Check for Discord timestamp format
    expect(calledWithArg).toContain(':f>');
    expect(calledWithArg).toContain(':R>');
  });

  it('should handle errors gracefully', async () => {
    const launchMock = vi.mocked(chromium.launch);
    launchMock.mockRejectedValue(new Error('Failed to launch browser'));

    await command.execute(mockContext);

    expect(mockContext.message.reply).toHaveBeenCalledWith('An error occurred while fetching the FPL deadline.');
  });

  it('should handle case where date element is not found', async () => {
    const mockDateText = null; // Simulate element not found

    const launchMock = vi.mocked(chromium.launch);
    const mockPage_goto = vi.fn().mockResolvedValue(undefined);
    const mockLocator_textContent = vi.fn().mockResolvedValue(mockDateText); // Return null
    const mockPage_locator = vi.fn().mockReturnValue({ textContent: mockLocator_textContent });
    const mockBrowser_newPage = vi.fn().mockResolvedValue({ goto: mockPage_goto, locator: mockPage_locator });
    const mockBrowser_close = vi.fn().mockResolvedValue(undefined);
    const mockBrowser = {
        newPage: mockBrowser_newPage,
        close: mockBrowser_close,
    };

    launchMock.mockResolvedValue(mockBrowser);

    await command.execute(mockContext);

    expect(mockContext.message.reply).toHaveBeenCalledWith('Could not find the FPL deadline on the page.');
  });
});
