---
title: "Attention-guided EfficientNetV2 + DenseNet ensemble for fashion item classification"
permalink: /portfolio/fashion-classification/
excerpt: "Fine-grained fashion classification; accuracy 0.917 → 0.972 over a ResNet-50 baseline. UNSW course project, 2024."
collection: portfolio
---

**Role:** project lead and core developer · **Period:** 09/2024 – 12/2024 · **Dataset:** Cleaned Type-aware Dataset (AiDLab fAshIon Data)

**What I did.**
* Built three classifiers: a ResNet-50 baseline, YOLOv4-MobileNetV3-LSKNet, and an EfficientNetV2 + DenseNet ensemble with attention-based feature fusion.
* Evaluated with accuracy, precision, recall, F1, per-class AP and mAP, and documented typical errors on visually similar items.

**Results.**

| Model | Accuracy | mAP |
|---|---|---|
| ResNet-50 (baseline) | 0.917 | 0.949 |
| EfficientNetV2 + DenseNet (attention) | **0.972** | **0.995** |

The final model reached precision 0.972, recall 0.972 and F1 0.972. Per-class analysis showed that most of the gain came from visually similar categories that the baseline had confused.
