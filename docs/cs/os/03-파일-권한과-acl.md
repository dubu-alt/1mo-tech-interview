# 파일 권한과 ACL

### 기본 권한 구조

```
-rwxr-x---  1  agent-dev  agent-core  monitor.sh
 ^^^         소유자        그룹
 |||
 ||+-- others (그 외)  : ---  (권한 없음)
 |+--- group           : r-x  (읽기/실행)
 +---- owner           : rwx  (읽기/쓰기/실행)
```

### 권한 숫자 표현

| 숫자 | 의미 |
| --- | --- |
| 4 | 읽기 (r) |
| 2 | 쓰기 (w) |
| 1 | 실행 (x) |

```bash
chmod 750 monitor.sh
# 7 = rwx (소유자)
# 5 = r-x (그룹)
# 0 = --- (그 외)
```

### 주요 명령어

```bash
# 소유자/그룹 변경
chown agent-dev:agent-core monitor.sh

# 권한 변경
chmod 750 monitor.sh

# 권한 확인
ls -l monitor.sh
```

### ACL (Access Control List)

기본 권한은 소유자/그룹/기타 3단계만 지정 가능하다. ACL은 특정 사용자나 그룹에 개별 권한을 추가로 부여할 때 사용한다.

```bash
# ACL 설치
apt install acl

# 특정 그룹에 rwx 권한 부여
setfacl -m g:agent-core:rwx /var/log/agent-app

# ACL 확인
getfacl /var/log/agent-app
```

---


> 출처: [Codyssey-B1/B4-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-1)