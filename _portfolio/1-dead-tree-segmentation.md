---
title: "Semantic segmentation of standing dead trees in aerial RGB+NIR imagery"
permalink: /portfolio/dead-tree-segmentation/
excerpt: "FCN vs SegFormer vs DeepLabV3+ on a 6-channel RGB+NIR input under extreme foreground imbalance. UNSW course project, 2025."
collection: portfolio
---

**Role:** project lead and lead developer · **Period:** 06/2025 – 09/2025 · **Dataset:** Kaggle *Aerial Imagery for Standing Dead Tree Segmentation*

**Problem.** Standing dead trees occupy a tiny fraction of pixels in aerial imagery, so a segmentation model can score well on accuracy while missing most of them.

**What I did.**
* Built a 6-channel input pipeline by fusing RGB with NIR-derived channels.
* Ran a controlled comparison of FCN-ResNet50 (baseline), SegFormer (MiT-B2) and DeepLabV3+.
* Treated foreground scarcity, rather than model capacity, as the main bottleneck: used architecture-specific hybrid losses (Focal + Dice for SegFormer; weighted cross-entropy + Tversky for FCN and DeepLabV3+), with warm-up scheduling, early stopping and stronger augmentation.

**Results (test set).**

| Model | mIoU | Recall | F2-score |
|---|---|---|---|
| FCN-ResNet50 (baseline) | 0.625 | 0.532 | 0.496 |
| SegFormer (MiT-B2) | **0.651** | **0.723** | – |
| DeepLabV3+ | – | – | **0.594** |

SegFormer gave the best overall overlap and recall, while DeepLabV3+ gave the best recall-weighted F2-score.
