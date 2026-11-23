---
title: "VPC and Subnets"
sidebar: "VPC and Subnets"
---

This article covers VPCs and subnets, the network you create first before launching a server on AWS.

## Regions and Availability Zones

A **Region** is an area where AWS data centers are clustered. Seoul is `ap-northeast-2`. An **Availability Zone (AZ)** is an independent group of data centers located apart from each other within one region; Seoul has AZs such as `ap-northeast-2a` and `2b`. They are separated so that if one AZ has a problem, the others stay up, which means spreading a service across multiple AZs makes it more resilient to failures.

B3-1 used only one AZ in the Seoul region (`ap-northeast-2a`).

## VPC

A **VPC (Virtual Private Cloud)** is your own isolated network inside AWS. A newly created VPC is not connected to the outside, so to communicate with the internet you have to attach an internet gateway and routing yourself.

## Setting the IP Range with CIDR

VPCs and subnets specify the IP range they use in CIDR notation. The number after `/` is the number of fixed bits from the front, and the smaller the number, the wider the range.

| Notation | Fixed bits | Number of IPs | In B3-1 |
|---|---|---|---|
| `10.0.0.0/16` | First 16 bits | 65,536 | Entire VPC |
| `10.0.1.0/24` | First 24 bits | 256 | Public subnet |

AWS reserves 5 IPs in every subnet (network address, VPC router, DNS, 1 reserved for future use, broadcast), so a `/24` subnet actually has 251 usable IPs.

## Subnets: Public and Private

A **subnet** is a section carved out of the VPC's IP range, and each subnet belongs to one AZ. Public and private are not options you pick when creating a subnet; they are determined by the **route table**.

| Category | Routing | Use |
|---|---|---|
| Public subnet | Has a `0.0.0.0/0 → internet gateway` route | Things that must be reachable from outside, like web servers and load balancers |
| Private subnet | No internet gateway route | Things that must not be reached directly from outside, like DBs and internal servers |

Even in a public subnet, an instance can't be reached from outside if it has no **public IP**. In B3-1, `map-public-ip-on-launch` was turned on for the subnet so that EC2 instances receive a public IP automatically when they are created.

## Interview Questions

### Q. What separates a public subnet from a private subnet?

This checks whether you just memorized the names or actually know what divides the two.

> If the route table attached to the subnet has a route to the internet gateway (`0.0.0.0/0 → IGW`), it is public; if not, it is private. The subnet itself does not have a "public" setting. Even in a public subnet, an instance needs a public IP to be reachable from outside, so in B3-1 I also turned on automatic public IP assignment for the subnet.

### Follow-up Questions

- How many IPs can be given to EC2 instances in a `/24` subnet?
  → Of the 256, AWS reserves 5, so 251.
- In real-world setups, which subnet does the web server go in?
  → Usually only the load balancer goes in the public subnet, and the web servers and DB go in private subnets. B3-1 was for learning, so the EC2 instance was placed directly in the public subnet.

> Source: [Codyssey-B1/B3-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-1)
