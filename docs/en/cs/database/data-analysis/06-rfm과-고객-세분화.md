---
title: "RFM and Customer Segmentation"
sidebar: "RFM and Customer Segmentation"
---

This page covers dividing customers, the core of A1-1. Who visits often and buys a lot is judged by RFM scores.

## Customer Segmentation

Instead of sending the same coupon to every customer, this method groups customers who behave similarly (segments) and uses a different strategy for each group.

## RFM Analysis

| Metric | Meaning | Calculation | Better when |
|---|---|---|---|
| R (Recency) | How recently they bought | Reference date - last purchase date | Smaller |
| F (Frequency) | How often they bought | Number of distinct orders | Larger |
| M (Monetary) | How much they spent | Total purchase amount | Larger |

Each of the three values gets a score from 1 to 5, and groups are divided by the combination of scores. For R, fewer days is better, so the scores are given in reverse. The reference date is usually set to the last transaction date in the data.

```python
rfm = df.groupby("customer_id").agg(
    last_order=("order_date", "max"),   # last purchase date → R
    frequency=("invoice", "nunique"),   # number of orders → F
    monetary=("amount", "sum"),         # total purchase amount → M
)
```

| Group | Condition (A1-1) | Meaning | Share of customers | Share of purchase amount |
|---|---|---|---|---|
| VIP | R≥4, F≥4, M≥4 | Recently, often, and a lot | 21.7% | 68.0% |
| Loyal | F≥4, R≥3 | Regulars who keep coming back | 10.3% | 10.1% |
| New | R≥4, F≤2 | Came recently but only a few times | 8.6% | 2.4% |
| Regular | Everyone else | Average | 19.5% | 6.5% |
| Churned | R≤2 | Churned customers who haven't come in a long time | 39.9% | 12.9% |

In A1-1, dividing 5,878 customers showed that the 21.7% who were VIPs accounted for 68.0% of the purchase amount, and Churned was the largest group at 39.9%.

## Cohort Analysis and Retention

A cohort is a group of people who had the same experience in the same period. Customers are usually grouped by the month of their first purchase, and a heatmap shows what percentage bought again some months later (retention, repurchase rate). If RFM shows the state of customers at the current point in time, cohort analysis shows how many customers remain as time goes by.

In A1-1, it was a bonus task, so it was not done. It is the analysis to try next in order to tell churned customers apart from customers who only buy at the end of the year.

## Interview Questions

### Q. What is RFM, and how far can you trust the customer groups you divided?

This checks whether you can point out the limits of the results yourself, not just explain the method.

> RFM is a method that divides customers by scoring the days since their last purchase (R), the number of orders (F), and the total purchase amount (M). However, it is hard to trust the results as is. The group criteria (e.g. VIP if R, F, and M are all 4 or higher) are rules I set, and the scores are relative, dividing customers into fifths, so changing the criteria changes the group sizes. Original orders that were later canceled are still in the data, so some customers' amounts are inflated too. To make it more trustworthy, you would need to pair up and remove original and canceled orders, and check how much the results shift as you change the criteria.

### Follow-up Questions

- How do you check that excluding the 22.8% without customer numbers doesn't distort the results?
  → You would need to compare the country and order amount distributions of transactions with and without customer numbers. This comparison was not done in A1-1.

> Source: [dubu-alt/A1-1](https://github.com/dubu-alt/A1-1) (Codyssey AI Advanced A1-1 mission)
