---
title: "Security Groups and NACLs"
sidebar: "Security Groups and NACLs"
---

This article covers the two firewalls that filter traffic on AWS: security groups and NACLs.

## Security Group

A **security group** is a firewall attached in front of an instance such as EC2. You can only write allow rules, and any traffic not listed is blocked. It is also **stateful**, so once an incoming request is allowed, its response goes out automatically regardless of the outbound rules.

The B3-1 security group rules are as follows.

| Direction | Protocol | Port | Source/Destination | Reason |
|---|---|---|---|---|
| Inbound | TCP | 80 | 0.0.0.0/0 | Anyone should be able to see the web page |
| Inbound | TCP | 22 | My IP/32 | SSH is for administration, so only my one IP |
| Outbound | All | All | 0.0.0.0/0 | Outgoing traffic such as package installs |

`/32` means exactly one IP address. Opening SSH to everyone would expose it directly to password and key brute-force attacks, so only my IP was allowed. No rule opening all ports (0-65535) was used.

## NACL (Network ACL)

A **NACL** is a firewall that filters traffic at the subnet boundary. You can write both allow and deny rules, and they are checked in order starting from the lowest rule number. It is **stateless**, so response traffic must be allowed separately too.

| Category | Security group | NACL |
|---|---|---|
| Applied to | Instance (network interface) | Subnet |
| Rules | Allow only | Allow and deny |
| State | Stateful: responses allowed automatically | Stateless: responses also need rules |
| Evaluation order | Looks at all rules together to decide | In number order; the first matching rule applies |
| In B3-1 | Created and used | Default NACL (allow all) left as is |

Usually, security groups do the fine-grained filtering, and NACLs are used to block a specific IP range for a whole subnet at once.

## Interview Questions

### Q. How are security groups and NACLs different?

This is the most frequently asked comparison in AWS networking questions.

> A security group is attached per instance, has only allow rules, and is stateful, so the response to an allowed request goes out automatically. A NACL is attached per subnet, can have both allow and deny rules, and is stateless, so response traffic also has to be opened with rules. In B3-1, I used the security group to open HTTP 80 to everyone and SSH 22 to only my one IP, and used the default NACL.

### Follow-up Questions

- Is it okay to leave all outbound traffic open?
  → The default was used for learning, but if the server is infected with malware, it could send data out. In real-world setups, it is safer to open only the destinations and ports that are needed.

> Source: [Codyssey-B1/B3-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-1)
