---
title: "IAM과 최소 권한"
sidebar: "IAM과 최소 권한"
---

누가 AWS에서 무엇을 할 수 있는지 정하는 IAM과, 권한을 꼭 필요한 만큼만 주는 최소 권한 원칙을 정리했습니다.

## IAM이란

**IAM(Identity and Access Management)**은 AWS 계정 안에서 누가 어떤 작업을 할 수 있는지 정하는 서비스입니다.

| 용어 | 뜻 |
|---|---|
| 루트 계정 | AWS에 가입한 이메일 계정. 모든 권한이 있어 평소에는 쓰지 않음 |
| IAM 사용자 | 사람이나 프로그램이 로그인하거나 CLI를 쓸 때 쓰는 계정 |
| IAM 그룹 | 사용자를 묶어 같은 권한을 주는 단위 |
| IAM 역할(Role) | EC2 같은 서비스나 다른 계정이 잠깐 빌려 쓰는 권한. 키를 따로 저장하지 않아도 됨 |
| 정책(Policy) | 무엇을 허용하거나 거부할지 적은 JSON 문서 |

## 정책 읽는 법

```json
{
  "Effect": "Allow",
  "Action": ["ec2:RunInstances", "ec2:DescribeInstances"],
  "Resource": "*",
  "Condition": { "StringEquals": { "ec2:Region": "ap-northeast-2" } }
}
```

`Effect`는 허용/거부, `Action`은 할 수 있는 작업, `Resource`는 대상, `Condition`은 추가 조건입니다. IAM은 아무 정책에도 허용되지 않은 작업을 기본으로 막고(암묵적 거부), 어딘가에 명시적 거부(`Deny`)가 있으면 허용이 있어도 거부가 이깁니다.

## 최소 권한 원칙

일에 꼭 필요한 권한만 주는 원칙입니다. `AdministratorAccess`처럼 모든 권한을 주면 편하지만 실수나 키 유출 한 번에 S3 공개, DB 삭제 같은 사고로 번질 수 있습니다.

B3-1에서는 루트 계정으로 작업용 IAM 사용자를 한 번만 만들고 그 뒤로는 이 사용자로 작업했습니다. 사용자에게는 아래 권한만 줬습니다.

| 허용한 서비스 | 허용한 작업 |
|---|---|
| EC2 | 인스턴스 생성·조회·종료, 태그 관리 |
| VPC | VPC, 서브넷, IGW, 라우팅 테이블 생성·조회·삭제 |
| 보안 그룹 | 생성, 규칙 추가·삭제, 조회 |
| EBS | 볼륨 생성·삭제·조회 |
| Cost Explorer | 비용 조회 (읽기 전용) |

S3, RDS, Lambda처럼 실습과 상관없는 서비스는 허용 목록에 넣지 않아서 막혔습니다.

![IAM 대시보드에서 iam:GetAccountSummary 등 여러 작업이 권한 없음으로 거부된 화면](/images/cloud/aws-iam-access-denied.jpg)
*그림: 최소 권한 IAM 사용자로 IAM 대시보드를 열면 허용하지 않은 작업이 거부된다.*

## 권한이 부족할 때

B3-1에서 EC2 생성이 `UnauthorizedOperation`으로 막힌 적이 있습니다. 이때 권한을 통째로 올리지 않고 `aws iam simulate-principal-policy`로 어느 작업이 막히는지 확인한 뒤, 리전 조건(`Condition`) 쪽을 고쳐 필요한 범위만 열었습니다.

## 면접에서 나올 만한 질문

### Q. 루트 계정 대신 IAM 사용자를 쓰고, AdministratorAccess를 주지 않은 이유는 무엇인가요?

편한 방법 대신 안전한 방법을 고른 이유를 설명할 수 있는지 봅니다.

> 루트 계정은 모든 권한을 갖고 있어 키가 새거나 실수하면 피해를 막을 방법이 없습니다. 그래서 루트로는 IAM 사용자만 만들고 실제 작업은 IAM 사용자로 했습니다. AdministratorAccess도 같은 이유로 주지 않고 B3-1에 필요한 EC2·VPC·보안 그룹·EBS 작업과 비용 조회만 허용했습니다. 권한이 부족한 에러가 나면 에러에 나온 작업 이름을 보고 그 작업만 추가하는 방식으로 넓혔습니다.

### 꼬리질문

- EC2 안에서 AWS API를 호출해야 하면 Access Key를 서버에 넣나요?
  → 넣지 않고 EC2에 IAM 역할을 붙입니다. 키를 저장하지 않아도 되고 AWS가 임시 자격 증명을 알아서 바꿔 줍니다.

> 출처: [Codyssey-B1/B3-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-1)
