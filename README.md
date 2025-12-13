# Light Controller - Home Assistant Add-on

A modern, responsive web interface for controlling Zigbee lights via Home Assistant with features for presets and custom groupings.

![License](https://img.shields.io/github/license/brsgr/ha-light-controller)
![Version](https://img.shields.io/badge/version-1.0.1-blue)

## Features

- **Real-time Control** - WebSocket connection for instant light state updates
- **Individual & Group Control** - Manage lights individually or as groups
- **Brightness Control** - Smooth brightness adjustment (0-100%)
- **Color Temperature** - Adjust warmth/coolness (Kelvin)
- **RGB Color Picker** - Full color control for RGB-capable lights
- **Scene Management** - Create, activate, and delete Home Assistant scenes
- **Responsive Design** - Works on desktop, tablet, and mobile

## Installation

### Option 1: Add Repository (Recommended)

1. In Home Assistant, navigate to **Settings** → **Add-ons** → **Add-on Store**
2. Click the **three dots menu** (top right) → **Repositories**
3. Add this repository URL:
   ```
   https://github.com/brsgr/ha-light-controller
   ```
4. Click **Add**
5. Refresh the page
6. Find **Light Controller** in the add-on list
7. Click **Install**

### Option 2: Manual Installation

1. SSH into your Home Assistant server
2. Navigate to the add-ons directory:
   ```bash
   cd /addons
   ```
3. Clone this repository:
   ```bash
   git clone https://github.com/brsgr/ha-light-controller.git light_controller
   ```
4. Go to **Settings** → **Add-ons** → **Add-on Store**
5. Refresh the page
6. Find **Light Controller** under "Local add-ons"
7. Click **Install**

## Configuration

After installing the add-on, you need to configure it:

1. Go to **Settings** → **Add-ons** → **Light Controller** → **Configuration**

2. Set the following options:

   - **ha_url**: `ws://homeassistant.local:8123/api/websocket`
     - Replace `homeassistant.local` with your Home Assistant hostname or IP address
     - Use `ws://` (not `wss://`) if your HA is on HTTP, or `wss://` if using HTTPS
     - If using a different port, adjust accordingly (e.g., `ws://192.168.1.100:8123/api/websocket`)
   
   - **ha_token**: Create a long-lived access token (optional - leave empty to use Supervisor token):
     - Go to your Home Assistant profile (click your name in the bottom left)
     - Scroll to "Long-Lived Access Tokens"
     - Click "Create Token"
     - Give it a name like "Light Controller"
     - Copy the token and paste it into the `ha_token` field
     - **Note**: If left empty, the add-on will automatically use the Supervisor token

3. Click **Save**

4. Start the add-on

5. Click **Open Web UI**

### Example Configuration

```yaml
ha_url: ws://homeassistant.local:8123/api/websocket
ha_token: ""  # Leave empty to use Supervisor token
```

### Configuration Notes

- The WebSocket URL must be accessible from your browser, not just from within the Docker container
- If your Home Assistant uses HTTPS, use `wss://` instead of `ws://`
- For most users, leaving `ha_token` empty will work automatically

## Usage

### Dashboard

- View all lights and light groups
- Toggle lights on/off
- Adjust brightness with sliders
- Set color temperature
- Pick RGB colors

### Presets (Scenes)

- View all Home Assistant scenes
- Click any scene to activate it instantly
- **Save Current State** - Captures the current state of all lights as a new scene
- Delete scenes you no longer need

### Groups

- Manage light groups from Home Assistant
- Control multiple lights simultaneously

## Network Access

The add-on exposes port **3000** for direct access:

- Local network: `http://<your-ha-ip>:3000`
- From within HA: Click **Open Web UI** button

## Technical Details

- **Framework**: Next.js 15 with React 18 and TypeScript
- **Styling**: Tailwind CSS
- **HA Integration**: home-assistant-js-websocket
- **Supported Architectures**: aarch64, amd64, armhf, armv7, i386

## Troubleshooting

### Add-on won't start

Check the logs in **Settings** → **Add-ons** → **Light Controller** → **Log** tab

### Connection issues

- Verify your `ha_url` is correct and accessible from your browser
- If using a token, ensure it's valid (create a new one if needed)
- Check that Home Assistant is accessible at the configured URL
- Try leaving `ha_token` empty to use the Supervisor token

### Lights not appearing

- Ensure your lights are visible in Home Assistant
- Check the WebSocket connection status on the dashboard
- Restart the add-on

## Development

To run locally for development:

```bash
npm install
npm run dev
```

Create `.env.local`:
```
NEXT_PUBLIC_HA_URL=ws://homeassistant.local:8123/api/websocket
NEXT_PUBLIC_HA_TOKEN=your_long_lived_token_here
```

## Support

Report issues at: https://github.com/brsgr/ha-light-controller/issues

## License

MIT License - see LICENSE file for details
