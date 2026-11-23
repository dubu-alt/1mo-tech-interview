---
title: "PCB and Context Switching"
sidebar: "PCB and Context Switching"
---

A PCB (Process Control Block) is **the card on which the operating system records the information for each individual process**, and context switching is **the process of saving the current state to the PCB and loading the next process's state from its PCB when the process running on the CPU is swapped for another**.

## At a Glance

- A CPU can run only one process at a time (per core). The reason you can still listen to music while writing a document is that the operating system **swaps processes in and out** every very short slice of time.
- Analogy: picture **a counselor** who takes turns seeing several clients alone.
  - Each client has **a counseling card (PCB)**. It records the name (PID), the current status, and how far the conversation got (where to resume next).
  - When the time with one client is up, the counselor writes down what was discussed on the card (save), then takes out the next client's card, reads it and carries on the session (restore). This changing of seats is **context switching**.
  - While writing and reading cards, the counselor cannot counsel anyone. This is the **overhead (cost)** of context switching.

## Process Management and Process Metadata

When there are several processes, the operating system deciding and managing who uses the CPU and when through [CPU scheduling](/en/cs/os/05-cpu-분석) is called **process management**.

To manage processes, the OS first needs to know **who each process is and what state it is in**. This information describing a process's characteristics is called **process metadata**.

| Metadata | Meaning |
|------------|-----|
| Process ID (PID) | A unique number that identifies the process |
| Process State | The current state (ready, running, waiting, etc. Explained below) |
| Process Priority | Priority. Used to decide who runs first when scheduling |
| CPU Registers | The CPU register values at the moment it stopped. Includes the address of the next instruction to run (PC) |
| Owner | The user who started this process (used for permission checks) |
| CPU Usage | How much CPU it has used so far |
| Memory Usage | How much memory it is using, and where |

This metadata is stored in the **PCB** when the process is created.

## PCB (Process Control Block)

The PCB is **where process metadata is stored**. One PCB holds the information of one process. The operating system (kernel) creates and manages it in its own memory area, so ordinary programs cannot modify a PCB directly.

As in the picture below, when a program on the storage device is run and becomes a process, the code, data and stack segments are created in memory, and along with them a PCB describing that process is created.

![When a program on the storage device runs, a PCB is created together with the code, data and stack segments](/images/os/pcb-program-to-process.png)

*Image source: [gyoogle Tech Interview Notes, Process Management & PCB](https://gyoogle.dev/blog/computer-science/operating-system/Process%20Management%20%26%20PCB.html)*

Here is what a single PCB contains.

```text
┌──────────────────────────────┐
│ PCB (one per process)          │
├──────────────────────────────┤
│ Pointer (address of next PCB)  │ ← PCBs are linked as a linked list
│ Process state (Ready ...)      │
│ Process ID (PID)               │
│ Program counter (PC)           │ ← location of the next instruction to run
│ CPU register values            │
│ Scheduling info (priority etc.) │
│ Memory management info         │
│ I/O status (open files etc.)   │
│ Accounting info (owner, CPU usage) │
└──────────────────────────────┘
```

### To Sum It Up Again

```text
Run a program
  → a process is created
  → the (code, data, heap, stack) segments are created in the process address space
  → this process's metadata is stored in the PCB
```

Each segment of the address space is covered in detail in the [Memory Layout](/en/cs/os/01-메모리-구조) article.

### Why Is the PCB Needed?

The CPU **swaps** the running process depending on process states. For example, when the running process goes into the Waiting state to wait for I/O, or when its set time runs out due to a timer [interrupt](/en/cs/os/08-인터럽트), another process is moved up to the Running state.

At that point, **the OS saves to the PCB how far the process that will run again later had gotten**. That way, on its next turn, it can continue from exactly where it stopped.

### How Are PCBs Managed?

- They are managed as a **linked list**.
- Each time a PCB is created, it is attached at the start (Head) of the PCB list. Because it is a linked list connected by addresses, inserting and removing in the middle is easy. (See [Doubly Linked List](/en/cs/data-structure/03-이중-연결-리스트))
- In other words, when a process is created, a PCB is created, and when the process ends, the PCB is removed too. (Strictly speaking, it is removed after the parent collects the exit status with `wait`. See zombie processes in [System Calls](/en/cs/os/09-시스템-콜))
- A real operating system keeps a separate line for each state. The line of PCBs waiting to run is called the **Ready Queue**, and the line of PCBs waiting for I/O is called the **Wait Queue**.

## Process States (5 of Them)

From birth to end, a process moves between the five states below.

```text
                   ┌──────────────── ② Dispatch ───────────────┐
                   │                                           ▼
 ┌──────┐ ① Admitted ┌───────┐                              ┌─────────┐  ⑥ Exit  ┌────────────┐
 │ New  │ ───────▶ │ Ready │ ◀──── ③ Time up (interrupt) ─── │ Running │ ───────▶ │ Terminated │
 └──────┘          └───────┘                              └─────────┘          └────────────┘
                       ▲                                       │
                       │                                       │ ④ I/O request / wait for event
                       │          ┌─────────┐                  │
                       └── ⑤ ──── │ Waiting │ ◀────────────────┘
                     I/O completed └─────────┘
```

| State | Meaning | Counselor analogy |
|------|----|-------------|
| New | The process is just being created | The counseling card is being made at the reception desk |
| Ready | Ready to run and only waiting for its turn on the CPU | Sitting in the waiting area for your turn |
| Running | Has the CPU and is actually executing instructions | Talking with the counselor right now |
| Waiting | Waiting for I/O or an event to finish. Even given the CPU, it has nothing to do | Off at another counter getting some paperwork |
| Terminated | Finished running | Session over, card filed away |

| No. | State change | When it happens |
|------|-----------|---------------|
| ① | New → Ready | The OS accepts the process and puts it in the ready queue |
| ② | Ready → Running | The scheduler picks this process and gives it the CPU (dispatch) |
| ③ | Running → Ready | Its allotted CPU time is over, or a more urgent process arrived and took the CPU |
| ④ | Running → Waiting | It requests I/O, like reading a file or keyboard input, and waits |
| ⑤ | Waiting → Ready | The I/O it was waiting for finished. It does not go straight to Running; it gets back in line |
| ⑥ | Running → Terminated | It finishes running or is forcibly terminated |

> A common question is why a process does not go straight from Waiting to Running. Even when the I/O is done, the CPU is already being used by another process, so it has to get back in line in the ready queue.

## Context Switching

When the running process is swapped, the CPU's register information changes; this is called **context switching**. Here, context means "how far the process had gotten and in what state it was running."

> Definition: the process in which the operating system **saves the state of the running process (register values, etc.) to that process's PCB**, and **reads the state from the PCB of the process to run next and loads it into the CPU registers**

```text
   Process A                Operating system          Process B
   (Running)                                        (Ready)
       │
       │── Interrupt / system call ──▶ Save A's state to PCB_A
       │                         Load B's state from PCB_B
     (Ready)                              │
                                          └──────────▶ (Running)
                                                          │
                          Save B's state to PCB_B ◀────────│ Interrupt / system call
                          Load A's state from PCB_A
       ◀───────────────────────────┘
   (Running)                                          (Ready)

   While state is being saved and loaded (the OS part in the middle),
   neither A nor B runs → this time is the overhead
```

### When Does It Happen?

It usually happens in cases like these.

- When an interrupt occurs
- When the running process **has used up its allowed CPU time (time slice)** (timer interrupt)
- When it **has to wait** for I/O

In other words, in the state diagram above, it happens **when a Running process gives up the CPU (③ Running → Ready, ④ Running → Waiting, ⑥ exit) and another process in the ready queue gets the CPU (② Ready → Running)**.

### Getting a Feel With Code: Imitating a Tiny Scheduler

Real context switching happens inside the kernel and cannot be seen directly, so let's look at the flow with a simple simulation that imitates the PCB with a dictionary. Each process runs 2 steps at a time, taking turns.

```python
from collections import deque

# Create one PCB (info card) per process
def make_pcb(pid, name, total_steps):
    return {"pid": pid, "name": name, "state": "Ready",
            "pc": 0,                 # line number to run next (program counter)
            "total": total_steps}

ready_queue = deque([make_pcb(1, "Music", 3), make_pcb(2, "Docs", 5)])
TIME_SLICE = 2                       # how long the CPU can be used at once (2 steps)

cpu_pc = None                        # CPU register (the location currently running)

while ready_queue:
    pcb = ready_queue.popleft()
    cpu_pc = pcb["pc"]               # load PCB → register (restore)
    pcb["state"] = "Running"

    for _ in range(TIME_SLICE):
        if cpu_pc == pcb["total"]:
            break
        cpu_pc += 1
        print(f"  {pcb['name']} runs line {cpu_pc}")

    pcb["pc"] = cpu_pc               # save register → PCB (keep)
    if pcb["pc"] == pcb["total"]:
        pcb["state"] = "Terminated"
        print(f"[done] {pcb['name']} terminated, PCB deleted")
    else:
        pcb["state"] = "Ready"
        ready_queue.append(pcb)
        print(f"[switch] save {pcb['name']}'s position {pcb['pc']} to its PCB and move to the next process")
```

Output:

```text
  Music runs line 1
  Music runs line 2
[switch] save Music's position 2 to its PCB and move to the next process
  Docs runs line 1
  Docs runs line 2
[switch] save Docs's position 2 to its PCB and move to the next process
  Music runs line 3
[done] Music terminated, PCB deleted
  Docs runs line 3
  Docs runs line 4
[switch] save Docs's position 4 to its PCB and move to the next process
  Docs runs line 5
[done] Docs terminated, PCB deleted
```

On its second turn, "Music" continued **from line 3** rather than line 1 because position 2 was saved to its PCB when its first turn ended.

## The Overhead of Context Switching

Overhead means **the extra time and resources** needed to do something. It is usually used in a negative sense. Context switching has overhead too.

- While state is being saved to and loaded from the PCB, the CPU **cannot do any process's work.**
- When it switches to a new process, the previous process's data in the CPU cache (a small store that keeps frequently used data close to the CPU) becomes useless, so things slow down for a while as data is read from memory again.
- So switching too often can make the switching time longer than the time spent actually working.

Even so, this overhead **is worth paying.**

```text
While running a process, an I/O event occurs and it switches to the waiting state
Running another process at this point is far more efficient than just leaving the CPU idle
```

In other words, the goal is to run another process so the CPU does not sit idle while waiting for I/O, and to get work done quickly for the user, as if several programs were responding at the same time. The gain from reducing CPU idle time is much bigger than the cost of switching.

> Switching between **threads** of the same process is lighter than switching between processes, because they share memory regions and there is less information to save and swap. (See [Processes and Threads](/en/cs/os/02-프로세스와-스레드))

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| Process management | The operating system handing out the CPU to several processes in turns |
| Process metadata | A process's personal details, such as PID, state, priority and register values |
| PCB | A counseling card, one per process. Records how far it got |
| PCB management | Kept in a linked list: added when a process is created, deleted when it ends |
| 5 states | New, Ready, Running, Waiting, Terminated. After Waiting, it gets back in line at Ready |
| Context switching | Write the current client's story on their card, take out the next client's card and carry on |
| When it happens | When the running process gives up the CPU, e.g. on an interrupt, when its time is up, or while waiting for I/O |
| Overhead | The time when nothing gets done while cards are being written and read |
| Why it is worth it | Giving the CPU other work beats letting it sit idle waiting for I/O |
