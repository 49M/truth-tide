# Truth Tide

Truth Tide is a financial analysis tool designed to help you detect bias in finance-related articles and posts on Reddit and Twitter. With this extension, you can quickly identify potentially misleading or biased content and understand the reasoning behind each flagged section.

## Features

- **Bias Detection**: Automatically highlights sentences in financial posts that may contain bias.
- **Clear Explanations**: Provides context for why a particular sentence was flagged.
- **User-Friendly Interface**: Simple, side-panel UI for easy navigation and review.

## Prerequisites

- npm
- A Chromium-based browser (e.g., Google Chrome)

## Installation

1. **Clone the Repository**
```bash
git clone <repository_url>
```

2. **Install Dependencies**
Open the project in your code editor and run:
```bash
npm install
```

3. **Build the Extension**
In your terminal, execute:
```bash
npm run build
```

## Setup

1. Open your Chromium-based browser (Google Chrome is recommended).
2. Navigate to the Extensions page.
3. Enable Developer Mode (usually found in the top right corner).
4. Click on "Load unpacked".
5. Select the `build` folder inside the cloned repository.

The extension should now appear as "Truth-Tide 1.0.0" in your list.

## Usage

1. **Navigate to a Post**:
   Visit Reddit or Twitter and open any finance-related post.

2. **Activate the Extension**:
   Click the Truth Tide extension icon in your browser toolbar.

3. **Open the Side Panel**:
   Select "Open in side panel" to view the extension's UI.

4. **Detect Bias**:
   Toggle the bias detection switch to YES.
   - The extension will highlight sentences that are flagged as biased or questionable.
   - For more information on why a sentence was flagged, refer to the detailed explanation within the UI (action required: <Do Action>).

## Additional Information

Truth Tide aims to empower you by revealing hidden biases in financial content, helping you avoid scams and be aware of potential conflicts of interest.
