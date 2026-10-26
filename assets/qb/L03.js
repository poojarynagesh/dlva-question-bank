// Lecture 3 — Image classification, NN/kNN, cross-validation, linear classifiers.
(function () {
  const R = String.raw;
  (window.QB_ALL = window.QB_ALL || {})["L03"] = {
    id: "L03",
    points: [
      R`Challenges: viewpoint, illumination, deformation, occlusion, background clutter, intra-class variation, multiple objects per image.`,
      R`Data-driven approach: collect labelled data → train → evaluate on a <strong>held-out test set never used for any decision</strong>.`,
      R`<strong>Nearest neighbour</strong>: train $O(1)$ (store), predict $O(n)$ — backwards from what we want. Training accuracy is 100% (distance to itself is 0) → overfitting, jagged boundaries.`,
      R`<strong>kNN</strong>: majority vote of $K$ neighbours; smoother boundaries; training accuracy can drop below 100% (isolated, often mislabelled points get outvoted); larger $K$ is not always better; $K=n$ always predicts the majority class.`,
      R`Hyperparameters ($K$, distance metric) are chosen by <strong>cross-validation</strong> on validation folds carved from the training set — never on the test set.`,
      R`$d_{L1}=\sum_p|I_1^p-I_2^p|$, $d_{L2}=\sqrt{\sum_p(I_1^p-I_2^p)^2}$. A shifted, a masked and a darkened ($\times0.9$) image can have the same L2 distance → pixel distances are poor semantic measures.`,
      R`Linear classifier $f(x,W)=Wx+b$; CIFAR-10: $x\in\mathbb{R}^{3072}$, $W\in\mathbb{R}^{10\times3072}$ (30,720 weights + 10 biases). Each row of $W$ is one <strong>template</strong> per class (horse with two heads, bluish ship); cannot separate XOR-like data; remains the last layer of deep nets.`,
    ],
    mcq: [
      { pts: 1, k: "interpret", q: R`A 1-NN classifier on CIFAR-10 scores 100% on the training set and 35% on the test set. Which statements are true?`,
        o: [R`The 100% training accuracy is guaranteed by construction and says nothing about generalisation`, R`The model is overfitting: its decision boundary follows every training point`, R`Switching to kNN with a cross-validated $K>1$ may improve test accuracy`, R`The test accuracy proves pixel L2 distance is the best metric for CIFAR-10`], a: [0, 1, 2],
        x: R`Each training image is its own nearest neighbour (distance 0). A larger $K$ smooths the boundary. Pixel distances are a weak semantic measure, so (d) is wrong.` },
      { pts: 2, k: "trap", q: R`A kNN classifier is trained on $n$ points from 3 classes. Which statements are true?`,
        o: [R`With $K=n$, every test point is assigned the majority class of the training set`, R`Choosing an odd $K$ guarantees there are never ties`, R`On the training set, kNN with $K=5$ can misclassify a point whose label disagrees with its neighbours`, R`Prediction cost grows linearly with $n$ unless approximate nearest-neighbour search is used`], a: [0, 2, 3],
        x: R`Odd $K$ prevents ties only for two classes; with three classes $K=3$ can split 1–1–1. $K=n$ makes every vote identical. Exact kNN must compare against all $n$ points.` },
      { pts: 1, k: "scenario", q: R`A team tries $K\in\{1,3,5,7\}$, picks $K=5$ because it gives the best accuracy on the <em>test</em> set, and reports that accuracy (92%). Which statements are true?`,
        o: [R`92% is an optimistic, biased estimate of performance on new data`, R`The test set has effectively become part of model selection`, R`They should choose $K$ by cross-validation on the training data and evaluate on the test set once`, R`The procedure is fine because no weights were trained on the test set`], a: [0, 1, 2],
        x: R`Choosing a hyperparameter is a form of fitting. Any decision based on test accuracy leaks test information.` },
      { pts: 1, single: true, k: "compute", q: R`An image $x$ is darkened to $0.9x$. For a 3-pixel image $x=[100,200,100]$, what is the L2 distance between $x$ and $0.9x$?`,
        o: [R`$\approx 24.5$`, R`40`, R`600`, R`$\approx 7.7$`], a: [0],
        x: R`The difference is $0.1x=[10,20,10]$; $\sqrt{100+400+100}=\sqrt{600}\approx24.5$. A barely visible change gives a large distance — and a shift or a mask can give the same value.` },
      { pts: 1, k: "trap", q: R`Two features are used for kNN: height (in metres, about 1.5–1.9) and weight (in grams, about 50,000–90,000). Which statements are true?`,
        o: [R`The L2 distance is dominated almost entirely by weight`, R`Standardising each feature (zero mean, unit variance) before kNN changes which neighbours are found`, R`Converting height to millimetres would not change the neighbours`, R`Under L1 distance, rotating the coordinate axes can change the distances, while L2 is unchanged by rotation`], a: [0, 1, 3],
        x: R`Distances depend on units: scaling a feature changes its influence, so (c) is false. L2 is rotation-invariant; L1 depends on the coordinate frame.` },
      { pts: 1, single: true, k: "compute", q: R`Exact 1-NN on CIFAR-10 with L1 distance on raw pixels. Roughly how many absolute differences are computed to classify <em>one</em> test image?`,
        o: [R`3,072`, R`50,000`, R`$\approx1.5\times10^8$`, R`$\approx3\times10^{10}$`], a: [2],
        x: R`$50{,}000$ training images × $3072$ values $\approx1.54\times10^8$ — per test image, which is why NN prediction is slow.` },
      { pts: 2, k: "interpret", q: R`A linear classifier is trained on CIFAR-10 and the rows of $W$ are visualised. Which statements are true?`,
        o: [R`The horse template shows two heads because it averages left- and right-facing horses`, R`The ship template is bluish because ships usually appear on water — the template captures context`, R`Since score $=w_c\cdot x+b_c$, classification is matching the image against one template per class`, R`Adding more training images will let a single template represent several distinct poses separately`], a: [0, 1, 2],
        x: R`One linear template must average all appearances of a class; more data cannot give it multiple modes. That needs a nonlinear (multi-layer) model.` },
      { pts: 1, single: true, k: "compute", q: R`A linear classifier on 4-pixel images with 3 classes has $W=\begin{bmatrix}1&0&-1&0\\0&1&0&1\\-1&1&1&0\end{bmatrix}$, $b=[0,\,-1,\,2]$ and input $x=[2,1,0,3]$. Which class is predicted?`,
        o: [R`Class 1 (score 2)`, R`Class 2 (score 3)`, R`Class 3 (score 1)`, R`Classes 1 and 2 tie`], a: [1],
        x: R`Scores: $2-0+0=2$; $1+3-1=3$; $-2+1+0+2=1$. The highest is class 2.` },
      { pts: 1, k: "trap", q: R`Data from two classes form an XOR pattern: class A at $(1,1)$ and $(-1,-1)$, class B at $(1,-1)$ and $(-1,1)$. Which statements are true?`,
        o: [R`No linear classifier $w\cdot x+b$ can separate them perfectly`, R`A 1-NN classifier classifies all four training points correctly`, R`Adding the feature $x_1x_2$ makes the classes linearly separable`, R`A linear classifier can do it if trained long enough`], a: [0, 1, 2],
        x: R`XOR is the classic non-linearly-separable case. NN is perfect on its own training set. With $x_1x_2$ (positive for A, negative for B) a single threshold works — the motivation for learned nonlinear features.` },
    ],
    short: [
      { pts: 2, k: "interpret", q: R`Why is the nearest-neighbour classifier described as "backwards" from what we want in deployment?`,
        a: R`<p>Training is $O(1)$ (store the data) but every prediction is $O(n)$, comparing against all training images. We can afford slow, offline training, but prediction (e.g. in autonomous driving) must be fast. A parametric model such as $Wx+b$ is the opposite: expensive training, then a single matrix–vector product per prediction.</p>` },
      { pts: 2, k: "scenario", q: R`You have 50,000 labelled images and a 10,000-image test set, and want to choose $K$ for kNN. Describe exactly what you would do.`,
        a: R`<p>Lock the 10,000 test images away. Split the 50,000 training images into, say, 5 folds of 10,000. For each candidate $K$, run 5 experiments — each fold in turn is the validation set and the other four are the "training" set — and average the 5 validation accuracies. Pick the $K$ with the best average (consider the variance across folds too). Then use all 50,000 images with that $K$ and report test accuracy once.</p>` },
      { pts: 2, k: "interpret", q: R`Why can kNN (with $K>1$) score less than 100% on its own training data, and why is this not necessarily bad?`,
        a: R`<p>A point whose label disagrees with most of its $K$ neighbours is outvoted (in NN its own copy at distance 0 decides). Such isolated points are often <strong>annotation errors</strong> or outliers, so refusing to fit them gives a smoother boundary that generalises better. Training accuracy is not the target; validation accuracy is.</p>` },
      { pts: 2, k: "interpret", q: R`Three modified versions of an image — shifted, partly masked and uniformly darkened — have the same L2 distance from the original. What does this imply for kNN on raw pixels, and what is the remedy?`,
        a: R`<p>The pixel metric does not reflect semantic similarity: changes a human sees as trivial (darkening, a small shift) can be as "far" as destroying content (masking). kNN on raw pixels therefore finds neighbours that share brightness or background, not the same object. Remedy: compute distances on <strong>learned features</strong> (e.g. CNN embeddings), where semantically similar images are close.</p>` },
      { pts: 2, k: "interpret", q: R`Parameters versus hyperparameters: give one of each from this lecture, and explain why hyperparameters cannot be learned by minimising the training loss.`,
        a: R`<p>Parameters: $W, b$ of the linear classifier, learned from data. Hyperparameters: $K$ and the distance metric in kNN, set before training. Minimising <em>training</em> error would always choose $K=1$ (100% training accuracy) — the trivially overfitting choice — so hyperparameters must be selected on held-out validation data.</p>` },
    ],
    long: [
      { pts: 8, k: "compute", q: R`<p>Six labelled 2-D training points and a test point $T=(0,0)$:</p>
<table><tr><th>Point</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr>
<tr><th>Coordinates</th><td>(1, 0)</td><td>(0, 2)</td><td>(−1.5, 0)</td><td>(1, 0.8)</td><td>(0, −3)</td><td>(2, 2)</td></tr>
<tr><th>Class</th><td>red</td><td>red</td><td>blue</td><td>blue</td><td>red</td><td>blue</td></tr></table>`,
        parts: [
          { pts: 2, q: R`Compute the L2 distance from $T$ to every training point and rank them.`,
            a: R`<p>A: 1; B: 2; C: 1.5; D: $\sqrt{1+0.64}\approx1.281$; E: 3; F: $\sqrt8\approx2.828$. Ranking: A (1) &lt; D (1.281) &lt; C (1.5) &lt; B (2) &lt; F (2.828) &lt; E (3).</p>` },
          { pts: 2, q: R`Using L2 distance, classify $T$ with $K=1$, $K=3$ and $K=5$.`,
            a: R`<p>$K=1$: A → <strong>red</strong>. $K=3$: A (red), D (blue), C (blue) → <strong>blue</strong>. $K=5$: A, D, C, B, F → red 2, blue 3 → <strong>blue</strong>.</p>` },
          { pts: 2, q: R`Repeat for $K=5$ using L1 distance. Does the prediction change, and why?`,
            a: R`<p>L1: A 1, B 2, C 1.5, D 1.8, E 3, F 4. The five nearest are A, C, D, B, E → red 3 (A, B, E), blue 2 → <strong>red</strong>. The prediction flips: F (diagonal, far under L1) leaves the neighbourhood and E (on an axis) enters it. L1 penalises diagonal offsets more than L2.</p>` },
          { pts: 2, q: R`What would $K=6$ predict, and what do all these results tell you about choosing $K$ and the metric?`,
            a: R`<p>$K=6$ uses every point: 3 red vs 3 blue — a <strong>tie</strong> (and in general $K=n$ just returns the majority class). Predictions depend strongly on both $K$ and the metric, and neither "larger $K$" nor a particular metric is always right; choose both by cross-validation on training data, keeping the test set for the final evaluation.</p>` },
        ] },
    ],
  };
})();
