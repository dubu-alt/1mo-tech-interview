---
title: "IAM and Least Privilege"
sidebar: "IAM and Least Privilege"
---

This article covers IAM, which decides who can do what on AWS, and the principle of least privilege, which means granting only as much permission as is truly needed.

## What Is IAM?

**IAM (Identity and Access Management)** is the service that decides who can perform which actions within an AWS account.

| Term | Meaning |
|---|---|
| Root account | The email account used to sign up for AWS. It has every permission, so it is not used day to day |
| IAM user | An account used when a person or program logs in or uses the CLI |
| IAM group | A unit that bundles users to give them the same permissions |
| IAM role | Permissions temporarily borrowed by a service like EC2 or by another account. No keys need to be stored separately |
| Policy | A JSON document that states what to allow or deny |

## How to Read a Policy

```json
{
  "Effect": "Allow",
  "Action": ["ec2:RunInstances", "ec2:DescribeInstances"],
  "Resource": "*",
  "Condition": { "StringEquals": { "ec2:Region": "ap-northeast-2" } }
}
```

`Effect` is allow/deny, `Action` is the actions that can be performed, `Resource` is the target, and `Condition` is an extra condition. By default, IAM blocks any action that no policy allows (implicit deny), and if there is an explicit deny (`Deny`) anywhere, the deny wins even if there is also an allow.

## Principle of Least Privilege

This is the principle of granting only the permissions a job really needs. Giving every permission, as with `AdministratorAccess`, is convenient, but a single mistake or leaked key can escalate into incidents like an S3 bucket going public or a DB being deleted.

In B3-1, I used the root account only once to create an IAM user for the work, and did everything after that as this user. The user was given only the permissions below.

| Allowed service | Allowed actions |
|---|---|
| EC2 | Create, view, and terminate instances; manage tags |
| VPC | Create, view, and delete VPCs, subnets, IGWs, and route tables |
| Security groups | Create, add/remove rules, view |
| EBS | Create, delete, and view volumes |
| Cost Explorer | View costs (read-only) |

Services unrelated to the lab, such as S3, RDS, and Lambda, were not put on the allow list, so they were blocked.

![The IAM dashboard showing several actions, such as iam:GetAccountSummary, denied for lack of permission](/images/cloud/aws-iam-access-denied.jpg)
*Figure: When the least-privilege IAM user opens the IAM dashboard, actions that were not allowed are denied.*

## When Permissions Are Missing

In B3-1, EC2 creation was once blocked with `UnauthorizedOperation`. Instead of raising permissions wholesale, I used `aws iam simulate-principal-policy` to find which action was being blocked, then fixed the region condition (`Condition`) to open up only the range that was needed.

## Interview Questions

### Q. Why did you use an IAM user instead of the root account, and why didn't you grant AdministratorAccess?

This checks whether you can explain why you chose the safe way over the convenient way.

> The root account has every permission, so if its key leaks or a mistake is made, there is no way to contain the damage. So I used root only to create an IAM user, and did the actual work as the IAM user. For the same reason, I didn't grant AdministratorAccess either, and allowed only the EC2, VPC, security group, and EBS actions B3-1 needed, plus cost viewing. When a permission error came up, I widened permissions by looking at the action name in the error and adding only that action.

### Follow-up Questions

- If you need to call AWS APIs from inside EC2, do you put an Access Key on the server?
  → No. You attach an IAM role to the EC2 instance. No keys need to be stored, and AWS rotates the temporary credentials automatically.

> Source: [Codyssey-B1/B3-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-1)
