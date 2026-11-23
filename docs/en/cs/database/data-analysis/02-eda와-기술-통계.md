---
title: "EDA and Descriptive Statistics"
sidebar: "EDA and Descriptive Statistics"
---

This page covers the step of looking at what the data looks like before starting the analysis.

## Multimodal Data

This means a mix of data in different forms (modalities). Online store data contains order quantity (numeric), country (categorical), product name (text), order date (date), and product photos (images) together. Each form is handled differently, so for analysis the goal is to turn everything into numeric columns and gather them into a single table.

In A1-1, image arrays were attached to the transaction data (numeric, categorical, text, date), so 5 types were handled in one table.

## EDA (Exploratory Data Analysis)

Short for Exploratory Data Analysis. It is the step of summarizing and plotting data to first understand its structure, blanks, strange values, and distributions before forming hypotheses or drawing conclusions. In Pandas, you usually start with `info()` (column names, data types, number of blanks), `describe()` (summary statistics), and `head()` (first 5 rows).

In A1-1, seeing a minimum price of -53,594 in `describe()` revealed that rows other than sales were mixed in.

## Descriptive Statistics and Distributions

| Metric | Meaning |
|---|---|
| Mean | Total sum ÷ count. Easily pulled by extreme values |
| Median | The middle value when sorted by size. Not easily shaken by extreme values |
| Standard deviation | How spread out the values are from the mean |
| Quartiles | The boundaries that split sorted data into 4 equal parts. Q1 (25%), Q2 (50%, median), Q3 (75%) |

If the mean is much larger than the median, it is a right-skewed distribution with a long right tail, where a few large values pull the mean up.

In A1-1, the mean order amount was 20.32 and the median was 10.08, about a 2x difference, so the median and quartiles were used as the representative values.

## Interview Questions

### Q. Which should you use as the representative value, the mean or the median?

This checks whether you can choose a representative value by looking at the data's distribution, rather than whether you memorized formulas.

> If the distribution is skewed to one side or has extreme values, the median is better. The mean gets pulled by a few large values, but the median is the value in the middle position, so it doesn't shake easily. In A1-1, the order amount had a mean of 20.32 and a median of 10.08, about a 2x difference, and typical orders were between about 4 and 18, from Q1 to Q3. Looking only at the mean would make a normal order look bigger than it really is, so the median and quartiles were looked at together.

> Source: [dubu-alt/A1-1](https://github.com/dubu-alt/A1-1) (Codyssey AI Advanced A1-1 mission)
