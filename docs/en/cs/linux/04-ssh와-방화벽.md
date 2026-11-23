---
title: "SSH Security and Firewalls"
---

This page covers the two things that control outside access to a server: SSH security settings and the firewall.

## SSH Security Settings

### What Is SSH

SSH is a protocol for connecting to a remote server over an encrypted connection. The default port is 22.

### Configuration File

```
/etc/ssh/sshd_config
```

### Settings to Change in This Mission

```bash
# Change the port
Port 20022

# Block root login
PermitRootLogin no
```

### Applying the Settings

```bash
# Check the config file syntax
sshd -t

# Restart the SSH service
systemctl restart sshd

# Check the service status
systemctl status sshd
```

### Why Change the Port and Block Root

The default port 22 is the main target of automated hacking tools (bots). Changing the port greatly cuts down brute-force attempts. Root has full control over the whole system, so if it can be reached directly from outside, a breach can be catastrophic.

## Firewall

### UFW (Ubuntu's Default Firewall)

```bash
# Enable UFW
ufw enable

# Allow ports
ufw allow 20022/tcp
ufw allow 15034/tcp

# Check status
ufw status

# Example output
# To                Action  From
# 20022/tcp         ALLOW   Anywhere
# 15034/tcp         ALLOW   Anywhere
```

### firewalld

```bash
# Enable
systemctl start firewalld
systemctl enable firewalld

# Allow ports
firewall-cmd --permanent --add-port=20022/tcp
firewall-cmd --permanent --add-port=15034/tcp
firewall-cmd --reload

# Check
firewall-cmd --list-all
```

### What a Firewall Does

It filters inbound traffic port by port. Every connection coming in on a port that is not allowed gets blocked. The basic rule is least privilege: "open only the ports you need."

## Summary

| Item | Details |
| --- | --- |
| SSH config file | `/etc/ssh/sshd_config` |
| SSH changes | `Port 20022`, `PermitRootLogin no` |
| Applying SSH changes | `sshd -t` → `systemctl restart sshd` → `systemctl status sshd` |
| UFW | `ufw enable`, `ufw allow 20022/tcp`, `ufw allow 15034/tcp`, `ufw status` |
| firewalld | `firewall-cmd --permanent --add-port=...`, `--reload`, `--list-all` |
| Principle | Least privilege: open only the ports you need |

> Source: [Codyssey-B1/B4-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-1)
