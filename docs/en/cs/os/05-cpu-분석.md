---
title: "CPU Analysis (Scheduling · Utilization · Cooldown)"
sidebar: "CPU Analysis"
---

This page sums up the essential concepts for B4-2 issue 02 (CPU analysis) and how the CpuWorker behaved in the actual test. The second half covers **CPU scheduling**, how the operating system divides up the CPU, in detail at a technical-interview level.

## Essential Concepts for CPU Analysis

### 1. CPU Scheduling

**Definition**: When several processes share the CPU, deciding which process gets to use the CPU and when

**Real-world example**:
```
If there are 4 processes during 1 second:
- Process A: uses the CPU from 0.0 to 0.25s
- Process B: uses the CPU from 0.25 to 0.5s
- Process C: uses the CPU from 0.5 to 0.75s
- Process D: uses the CPU from 0.75 to 1.0s

→ The OS runs the processes in turns
```

**In our test**:
```
CpuWorker uses 5% to 30% of the CPU
= The OS assigns part of the CPU time to CpuWorker
= The rest of the CPU is assigned to other processes
```

### 2. CPU Utilization

**Definition**: The share of time the CPU is actually doing work

**Calculation**:
```
CPU utilization = (actual work time / total time) × 100%

Examples:
- 0.3s of work in 1 second → 30% CPU utilization
- 0.05s of work in 1 second → 5% CPU utilization
```

**What shows up in the log**:
```
2026-05-27 05:58:52,265 [INFO] [CpuWorker] Current Load: 5.00%
→ Means it used 5% of the CPU over the last second
```

### 3. CPU Limit / Threshold

**Definition**: The maximum share of the CPU a specific process may use

**Our test**:
```
CPU_MAX_OCCUPY=30%
= CpuWorker may use at most 30% of the CPU
= Anything over 30% is restricted
```

**Real-world example**:
```
If the computer's CPU capacity is 100%:
- This process: uses at most 30
- Other processes: share the remaining 70
```

### 4. Throttling

**Definition**: Deliberately reducing CPU usage

**In our log**:
```
2026-05-27 05:59:12,998 [INFO] [CpuWorker] Peak reached (30.00%). Starting cooldown...
```
→ When the CPU hit 30%, it reduced CPU usage (throttled)

**Everyday examples**:
```
- Laptop battery low → CPU speed lowered
- Phone running hot → CPU performance limited
- Server under heavy load → specific services rate-limited
```

### 5. Cooldown (Recovery Time)

**Definition**: A waiting period to get out of an overloaded state

**In our test**:
```
Phase 1: CPU rises (5% → 30%)
         ↓
Phase 2: Cooldown starts (Peak reached)
         CPU lowered from 30% → 5%
         Takes about 16 seconds
         ↓
Phase 3: Cooldown complete (5%)
         Starts rising again
```

**Timeline**:
```
05:59:12 - Cooldown starts
05:59:28 - Cooldown complete (about 16 seconds)
```

### 6. Workload

**Definition**: The amount or intensity of work a process has to do

**Our test**:
```
CpuWorker's workload:
- Start: low (uses only 5% CPU)
- Middle: rising (more and more computation)
- Peak: 30% (maximum allowed)
- Cooldown: lowered (deliberately reduces work)
```

## A Closer Look at CPU Scheduling

### What Scheduling Tries to Do

There is one CPU but many processes that want to run. Scheduling is **the set of rules for sharing the CPU well among processes while keeping it as busy as possible**. It is like one bank teller deciding in what order to serve several customers.

The conditions for good scheduling boil down to three.

- Low overhead (the cost of deciding and switching the order)
- High CPU utilization
- Little starvation (a process never getting its turn)

What matters more also depends on the kind of system.

| System | Goal | Example |
| --- | --- | --- |
| Batch | Get as much work done as possible in a given time (throughput) | Overnight settlement jobs |
| Interactive | Fast response, short waits | The PCs and smartphones we use |
| Real-time | Always meet the set deadline | Car brake control, aviation systems |

### Preemptive vs Nonpreemptive

- **Preemptive**: The operating system can forcibly take the CPU away from a running process and give it to another. Urgent work can be handled right away, so responsiveness is good, but frequent switching adds overhead and it is hard to predict when each job will finish.
- **Nonpreemptive**: Once a process gets the CPU, it keeps it until it finishes on its own or gives it up to wait for I/O and so on. Processing time is easy to predict, but if one long job holds the CPU for a long time, the short jobs behind it wait a long time.

### Process States and Scheduling

A process moves between the New, Ready, Running, Waiting and Terminated states.

```text
          Admitted          Dispatch
 [New] ─────────▶ [Ready] ─────────▶ [Running] ─────────▶ [Terminated]
                   ▲   ▲ ◀───────────  │       Exit
                   │   │   Interrupt   │
                   │   │ (time used up) │ Wait for I/O/event
                   │   └──── [Waiting] ◀──┘
                   │ I/O/event completed
```

| State change | Meaning |
| --- | --- |
| Admitted | The new process is allowed to be created and moves to Ready |
| Dispatch | One of the Ready processes is picked and put on the CPU |
| Interrupt | Its time ran out or something more urgent came up, so the running process is sent back to Ready |
| Wait for I/O/event | Something it must wait for came up, like reading a file, so it moves to Waiting |
| I/O/event completed | What it was waiting for finished, so it goes back to Ready |
| Exit | Finished running |

Looking at when the scheduler steps in makes the difference clear. A **nonpreemptive** scheduler picks the next process only when the running process moves to Waiting or terminates. A **preemptive** scheduler can also pick again when a process is sent back to Ready by an interrupt (timeout), and when a waiting process finishes its I/O and returns to Ready. States and the PCB are covered in more detail in [PCB and Context Switching](/en/cs/os/10-pcb와-컨텍스트-스위칭).

### Scheduling Algorithms

**Nonpreemptive**

1. **FCFS (First Come First Served)**: Jobs are handled in order of arrival. It is the simplest, but if a long job comes first, the short jobs behind it all wait in line. This is the **convoy effect**.
2. **SJF (Shortest Job First)**: The job expected to have the shortest run time goes first. It is known to give the shortest average waiting time, but long jobs can keep getting pushed back (starvation), and it is hard to know the run time accurately in advance.
3. **HRN (Highest Response-ratio Next)**: Fixes SJF treating long jobs too unfairly. Jobs with a higher value below go first, so the longer a job waits, the higher its priority.
   - Priority = (waiting time + run time) / run time

**Preemptive**

1. **SRTF (Shortest Remaining Time First)**: The preemptive version of SJF. Even while a job is running, if a job with a shorter remaining time arrives, the CPU is handed over to it.
2. **Priority Scheduling**: Jobs with a higher assigned priority go first. Low-priority jobs can be pushed back forever (**starvation**), which is solved by **aging**: raising the priority little by little the longer a job waits. (Priority scheduling can also be built as nonpreemptive.)
3. **Round Robin**: Jobs line up in order of arrival, but each gets the CPU only for the same **time quantum** (time slice), and if it does not finish, it goes to the back of the line. If the quantum is too large, it behaves like FCFS; if it is too small, context switches become frequent and overhead grows. Widely used in interactive systems.
4. **Multilevel Queue**: Jobs are split into several groups by type (e.g. system jobs, interactive jobs, batch jobs), each with its own queue. Each queue can use a different algorithm (Round Robin for interactive, FCFS for batch, etc.), and the queues have priorities among themselves. A job does not move from the queue it entered to another. To keep lower queues from starving while only the higher queues run, CPU time is sometimes divided among queues by ratio.
5. **Multilevel Feedback Queue**: A multilevel queue that **allows movement** between queues. The higher the queue, the higher its priority and the smaller its time quantum.
   - A job that uses up its quantum without finishing is treated as a CPU-heavy job (CPU burst) and moved down one queue.
   - A job that gives up the CPU on its own within its quantum, for I/O and so on, stays in its original queue.
   - As a result, short jobs and I/O-heavy jobs (jobs with frequent interrupts) get priority, and the average turnaround time drops. Jobs that wait too long in a lower queue may also be moved up to prevent starvation.

```text
Multilevel Feedback Queue
 Queue 0 (quantum 8ms)  ──▶ moved down if not finished
 Queue 1 (quantum 16ms) ──▶ moved down if not finished
 Queue 2 (FCFS)
 A lower queue runs only when the queues above it are empty
```

### Criteria for Evaluating Scheduling

| Criterion | Meaning |
| --- | --- |
| CPU utilization | The share of time the CPU kept working (higher is better) |
| Throughput | Jobs finished per unit of time (more is better) |
| Turnaround Time | Time from a job's arrival until it fully finishes = waiting time + run time |
| Waiting Time | Total time spent waiting for the CPU in the ready queue |
| Response Time | Time from arrival until the job first gets the CPU |

### Try the Math Yourself

Let's compare FCFS, SJF (nonpreemptive) and Round Robin (quantum 2) when 4 jobs arrive as below.

| Job | Arrival time | Run time |
| --- | --- | --- |
| P1 | 0 | 8 |
| P2 | 1 | 4 |
| P3 | 2 | 2 |
| P4 | 3 | 1 |

```python
from collections import deque

# (name, arrival time, run time)
jobs = [("P1", 0, 8), ("P2", 1, 4), ("P3", 2, 2), ("P4", 3, 1)]

def report(name, finish):
    print(f"[{name}]")
    total_wait = 0
    for p, arrive, burst in jobs:
        turnaround = finish[p] - arrive      # from arrival until finish
        wait = turnaround - burst            # the part spent waiting
        total_wait += wait
        print(f"  {p}: finished at {finish[p]:2}, turnaround {turnaround:2}, waiting {wait:2}")
    print(f"  average waiting time = {total_wait / len(jobs)}")

def fcfs():
    t, finish = 0, {}
    for p, arrive, burst in sorted(jobs, key=lambda j: j[1]):
        t = max(t, arrive) + burst
        finish[p] = t
    return finish

def sjf():  # nonpreemptive: whenever the CPU is free, pick the shortest arrived job
    t, finish, left = 0, {}, list(jobs)
    while left:
        ready = [j for j in left if j[1] <= t] or [min(left, key=lambda j: j[1])]
        p, arrive, burst = min(ready, key=lambda j: j[2])
        t = max(t, arrive) + burst
        finish[p] = t
        left.remove((p, arrive, burst))
    return finish

def round_robin(quantum):
    t, finish = 0, {}
    remain = {p: b for p, _, b in jobs}
    pending = sorted(jobs, key=lambda j: j[1])
    queue = deque()
    while len(finish) < len(jobs):
        while pending and pending[0][1] <= t:
            queue.append(pending.pop(0)[0])
        if not queue:
            t = pending[0][1]
            continue
        p = queue.popleft()
        run = min(quantum, remain[p])
        t += run
        remain[p] -= run
        while pending and pending[0][1] <= t:   # jobs that arrived during the run get in line first
            queue.append(pending.pop(0)[0])
        if remain[p] == 0:
            finish[p] = t
        else:
            queue.append(p)
    return finish

report("FCFS", fcfs())
report("SJF", sjf())
report("Round Robin (q=2)", round_robin(2))
```

```text
[FCFS]
  P1: finished at  8, turnaround  8, waiting  0
  P2: finished at 12, turnaround 11, waiting  7
  P3: finished at 14, turnaround 12, waiting 10
  P4: finished at 15, turnaround 12, waiting 11
  average waiting time = 7.0
[SJF]
  P1: finished at  8, turnaround  8, waiting  0
  P2: finished at 15, turnaround 14, waiting 10
  P3: finished at 11, turnaround  9, waiting  7
  P4: finished at  9, turnaround  6, waiting  5
  average waiting time = 5.5
[Round Robin (q=2)]
  P1: finished at 15, turnaround 15, waiting  7
  P2: finished at 11, turnaround 10, waiting  6
  P3: finished at  6, turnaround  4, waiting  2
  P4: finished at  9, turnaround  6, waiting  5
  average waiting time = 5.0
```

- With **FCFS**, the long job P1 (8), which arrived alone at time 0, grabs the CPU first, so the short P3 and P4 wait a long time (convoy effect).
- With **SJF**, after P1 finishes, jobs are handled shortest first (P4 → P3 → P2), so the average waiting time drops. In exchange, the longest job P2 is pushed to the very end.
- With **Round Robin**, P1 uses the CPU for only 2 before going to the back of the line, so the short P3 finishes right away at time 6. The average waiting time is also the shortest, but the longest job P1 finishes last, and switching jobs often costs context switches.

### Connecting It to the B4-2 Test

`CPU_MAX_OCCUPY` and the Cooldown that kept CpuWorker from going over 30% are the application reducing its own usage. Separately from that, the OS scheduler divides CPU time among all processes, and the remaining 70% was shared by other processes according to these scheduling rules.

## Recap: CPU (Issue 02)

```
CpuWorker keeps increasing the load
→ "Peak reached" when it hits 30%
→ Cooldown starts (load decreases automatically)
→ "Cooldown complete" when it drops to 5%
→ Load increases again
→ Repeat (endless cycle)

Conclusion: CPU works normally, the auto-throttling mechanism works well
```

## Summary

### CPU Concepts
1. **CPU scheduling**: How several processes share the CPU
2. **CPU utilization**: (actual work time / total time) × 100%
3. **Throttling**: Deliberately limiting CPU usage
4. **Cooldown**: A recovery period to get out of overload
5. **Workload**: The amount of work a process has to do

### CPU Scheduling Concepts

| Concept | Plain-language summary |
| --- | --- |
| Preemptive / Nonpreemptive | Whether or not the OS can take away the work in progress |
| FCFS | In order of arrival. If a long customer is in front, everyone waits |
| SJF / SRTF | Quickest jobs first. Short average wait, but long jobs keep getting pushed back |
| HRN | SJF where the longer you wait, the sooner your turn comes |
| Priority + Aging | Important work first; waiting too long raises your rank |
| Round Robin | Everyone takes turns with the CPU for the same amount of time |
| Multilevel (Feedback) Queue | Several lines; the feedback queue moves CPU-heavy work to a lower line |
| Turnaround / Waiting / Response time | Until finished / time spent waiting in line / until first getting the CPU |

### Study Tip: Understanding the CPU
1. What is CPU utilization? (= the share of time spent working)
2. What if you set a limit? (= CPU_MAX_OCCUPY)
3. What happens at the limit? (= automatic adjustment via Cooldown)
4. And the process? (= stays alive)

> Source: [Codyssey-B1/B4-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-2)
>
> References: [Scheduling goals](https://jhnyang.tistory.com/29), [Multilevel queue](https://jhnyang.tistory.com/28), [Multilevel feedback queue](https://jhnyang.tistory.com/156)
