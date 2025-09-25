## GitLab Forum MCP

⚠️ **This is an unofficial, community-created MCP** - not affiliated with or endorsed by GitLab Inc.

A Model Context Protocol (MCP) stdio server specifically configured for GitLab forum troubleshooting and support. This is a specialized fork of [discourse-mcp](https://github.com/discourse/discourse-mcp) optimized for https://forum.gitlab.com.

**Perfect for GitLab users and support teams** who need to quickly search, read, and analyze discussions on GitLab's community forum for troubleshooting CI/CD issues, GitLab features, and community support.

### GitLab-Specific Features
- 🎯 **Pre-configured for GitLab forum** (https://forum.gitlab.com)
- 🔍 **Enhanced search with GitLab compatibility fixes** - improved error handling and debug logging
- ⚡ **Optimized workflows** for GitLab troubleshooting scenarios
- 📁 **Ready-to-use profile** - just clone and run
- 🏷️ **GitLab-focused configuration** for common support topics

## Quick Start

### Command Line Usage

**Recommended: Run with GitLab forum profile**
```bash
npx -y @ahnmichael/gitlab-forum-mcp@latest --profile gitlab-forum-profile.json
```

**Alternative: Run with site parameter**
```bash
npx -y @ahnmichael/gitlab-forum-mcp@latest --site https://forum.gitlab.com
```

### Use in Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gitlab-forum": {
      "command": "npx",
      "args": ["-y", "@ahnmichael/gitlab-forum-mcp@latest", "--site", "https://forum.gitlab.com"]
    }
  }
}
```

Or with the profile configuration:
```json
{
  "mcpServers": {
    "gitlab-forum": {
      "command": "npx",
      "args": ["-y", "@ahnmichael/gitlab-forum-mcp@latest", "--profile", "/path/to/gitlab-forum-profile.json"]
    }
  }
}
```

## Available Tools

- **discourse_search** - Search GitLab forum discussions
- **discourse_read_topic** - Read full topic threads
- **discourse_read_post** - Read individual posts
- **discourse_list_categories** - Browse forum categories
- **discourse_list_tags** - Browse available tags
- **discourse_get_user** - Get user information
- **discourse_filter_topics** - Filter topics by various criteria

## Getting the Profile File

1. **Clone this repository:**
   ```bash
   git clone https://github.com/ahnmichael/gitlab-forum-mcp.git
   cd gitlab-forum-mcp
   ```

2. **Use the profile file:**
   ```bash
   npx -y @ahnmichael/gitlab-forum-mcp@latest --profile gitlab-forum-profile.json
   ```

## Requirements

- **Node.js**: >= 18
- **Internet connection** to access GitLab forum

## Contributing

This is a specialized fork of [discourse-mcp](https://github.com/discourse/discourse-mcp) for GitLab forum usage.

- **Report issues**: [GitHub Issues](https://github.com/ahnmichael/gitlab-forum-mcp/issues)
- **Source code**: Built with Node.js and TypeScript
- **Contributing**: PRs welcome for GitLab-specific improvements

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original [discourse-mcp](https://github.com/discourse/discourse-mcp) project by Discourse
- Enhanced search functionality developed through Claude Desktop testing