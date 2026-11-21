(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L03"] = [
    { h: R`Image classification and its seven difficulties`, t: "def", b: R`<p>An <strong>image classifier</strong> is a function $f(\text{image})\rightarrow\text{class label}$. Unlike sorting there is no step-by-step algorithm to write: the input is noisy and the same class appears in endless ways.</p>
<p>The professor's list of challenges:</p>
<ol><li><strong>Viewpoint variation</strong> (front / side / back)</li>
<li><strong>Illumination</strong> (dull-light cat looks dark, bright-light cat looks white)</li>
<li><strong>Deformation</strong> (a cat curled up or stretched)</li>
<li><strong>Occlusion</strong> (only a small part visible)</li>
<li><strong>Background clutter</strong> (object colour blends with the background)</li>
<li><strong>Intra-class variation</strong> (different cat breeds, all "cat")</li>
<li><strong>Multi-object images</strong> (cat, water can and light in one frame, but only one label is given)</li></ol>` },
    { h: R`Traditional versus data-driven`, b: R`<p><strong>Traditional</strong>: detect edges, find corners (where two or more edges meet; Harris detector), describe the image by junctions (T, Y, ...), then classify from these hand-crafted features. Fragile: even the single class "chair" has huge variety in corner patterns.</p>
<p><strong>Data-driven</strong> in three steps:</p>
<ol><li><strong>Collect</strong> images with human-provided labels (e.g. Mechanical Turk). More data is generally better.</li>
<li><strong>Train</strong> a model from $(X,Y)$; it starts randomly initialised ("raw") and improves. Typical split about 80-90% train, 10-20% test.</li>
<li><strong>Evaluate</strong> on held-out test images never seen in training; accuracy = fraction correct against ground truth.</li></ol>
<p>Rule: never mix test images into training.</p>` },
    { h: R`Nearest neighbour (NN) and kNN`, t: "exam", b: R`<p><strong>NN</strong>: training just <em>stores</em> data, $O(1)$. Prediction compares the test image with all $n$ stored images and copies the label of the closest, $O(n)$ per test image. This is backwards from what we want: slow training is acceptable, <strong>fast prediction is essential</strong> (e.g. self-driving). Approximate NN trades accuracy for speed on huge sets.</p>
<p><strong>kNN</strong>: take the $K$ closest training samples and output the <em>mode</em> (majority vote). It reduces sensitivity to a noisy or outlier neighbour.</p>
<table><tr><th></th><th>$K=1$</th><th>moderate $K$ (e.g. 5)</th></tr>
<tr><td>Decision boundary</td><td>jagged, overfits</td><td>smoother, more generic</td></tr>
<tr><td>Training accuracy</td><td><strong>always 100%</strong> (each point is its own neighbour, distance 0)</td><td>may be below 100%</td></tr></table>
<p>With kNN, an isolated sample surrounded by another class gets misclassified in training; the professor notes it might even be a labelling error. Odd $K$ avoids ties in two-class problems.</p>` },
    { h: R`Hyperparameters, validation and k-fold cross-validation`, t: "exam", b: R`<p><strong>Parameters</strong> (weights $W$) are learned. <strong>Hyperparameters</strong> ($K$, distance metric, later learning rate, $\lambda$) are set before training.</p>
<p>Never choose them on the test set; the test set is for the final report only. Carve a <strong>validation</strong> set out of the training data.</p>
<p><strong>$k$-fold cross-validation</strong> (lock the test set first):</p>
<ol><li>Split the training data into $k$ folds (say 5, each 20%).</li>
<li>For each candidate value (e.g. $K=1,3,5,7$) run 5 experiments, each fold taking one turn as validation.</li>
<li>Average the 5 accuracies and pick the value with the best average.</li></ol>
<p>Worked example: for one value of $K$ the fold accuracies are 0.60, 0.62, 0.58, 0.64, 0.56, so the average is $3.00/5=0.60$. Compare this average across candidates.</p>
<p>A validation set (about 5-10% of training data) is also used to watch training, stop early, and pick the best checkpoint.</p>
<p>Larger $K$ is <strong>not</strong> always better: too large a neighbourhood pulls in distant samples and misclassifies borderline points.</p>` },
    { h: R`Distance metrics and why pixel distance misleads`, t: "def", b: R`$$d_{L1}(I_1,I_2)=\sum_p |I_1^p-I_2^p|,\qquad d_{L2}(I_1,I_2)=\sqrt{\sum_p (I_1^p-I_2^p)^2}.$$
<p>The professor's striking example: an image that is <em>shifted</em>, one that is <em>partly masked</em> and one that is <em>darkened</em> (pixels $\times 0.9$) can all have the <strong>same L2 distance</strong> from the original, even though they are semantically very different changes. Raw pixel distance is not a meaningful similarity; learned (CNN) features are much better.</p>` },
    { h: R`The linear classifier`, t: "exam", b: R`$$f(x,W)=Wx+b,\quad x\in\mathbb{R}^{d},\; W\in\mathbb{R}^{C\times d},\; b\in\mathbb{R}^{C}.$$
<p>CIFAR-10: 10 classes, $32\times32\times3=3072$ pixels, so $W$ is $10\times3072$ = <strong>30,720</strong> weights (plus 10 biases). The highest of the 10 scores is the prediction. Toy case: 4 pixels, 3 classes gives $W$ of $3\times4$ (12 parameters).</p>
<ul><li>Each row of $W$ reshaped to $32\times32\times3$ is a <strong>template</strong> for that class: car looks vaguely like a car, horse shows two heads (left- and right-facing averaged), ship is bluish, bird/deer greenish, plane sky-like.</li>
<li>Only <strong>one template per class</strong>, one hyperplane per class: it cannot separate entangled (XOR-like) data. This motivates nonlinear networks.</li>
<li>Still a building block: CNN features $\rightarrow$ linear layer $\rightarrow$ softmax.</li></ul>
<p>CIFAR-10 facts: 50,000 train (5,000/class), 10,000 test (1,000/class), $32\times32$ pixels.</p>` },
    { h: R`Loss as "unhappiness"`, t: "def", b: R`<p>The loss measures how unhappy we are with the scores. Correct class has the highest score $\Rightarrow$ happy, loss zero. Otherwise unhappy, positive loss. The reference for "correct" comes from the <strong>ground-truth labels</strong> given by human annotators (supervised learning).</p>
$$L=\frac1m\sum_{i=1}^{m}L_i\big(f(x_i,W),y_i\big).$$
<p>It is <em>not</em> a plain subtraction like $8.0-2.9$; a proper loss (hinge or cross-entropy, next lecture) is used. Training = minimise this average over the training set.</p>` },
    { h: R`Common traps`, t: "pitfall", b: R`<ul>
<li>"NN is fast because it does no training": prediction is $O(n)$, which is the costly part.</li>
<li>"NN gets 100% on test data": that is for <em>training</em> data only (self-distance 0). It signals overfitting, not quality.</li>
<li>Tuning $K$ on the test set, or letting any test image into training.</li>
<li>"Bigger $K$ means higher accuracy" or "more folds means a different test set". Neither is true; $K$ is tuned by cross-validation.</li>
<li>Equal L2 distance does not mean equal semantic similarity.</li>
<li>Forgetting that a linear classifier's weight rows act as class templates, and that this is why it fails on multi-modal or interleaved classes.</li></ul>` },
  ];
})();
