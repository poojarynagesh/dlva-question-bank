// Lecture 4 — Hinge (SVM) loss, softmax / cross-entropy, regularization.
(function () {
  const R = String.raw;
  (window.QB_ALL = window.QB_ALL || {})["L04"] = {
    id: "L04",
    points: [
      R`Loss = "unhappiness": $L=\frac1N\sum_iL_i(f(x_i,W),y_i)+\lambda R(W)$.`,
      R`<strong>Hinge loss</strong> $L_i=\sum_{j\ne y_i}\max(0,s_j-s_{y_i}+\Delta)$, usually $\Delta=1$. Zero (and zero gradient) once every wrong class trails by the margin. Range $[0,\infty)$. At small random $W$: $L\approx C-1$.`,
      R`Gradient of hinge w.r.t. scores: $+1$ for each violating class $j$, and $-(\#\text{violators})$ for the correct class; non-violating classes get 0.`,
      R`Including $j=y_i$ adds a constant 1; mean vs sum is a scale; squared hinge penalises large violations more. If $W$ gives zero loss so does $\alpha W$ ($\alpha>1$) → $W$ is not unique → regularize.`,
      R`L1 $\sum|W|$: sparse, feature selection. L2 $\sum W^2$: small, spread-out weights, robust — preferred. $W_1=[1,0,0,0]$ vs $W_2=[.25,.25,.25,.25]$ on $x=[1,1,1,1]$: same score, same L1, L2 prefers $W_2$. Large $\lambda$ → underfitting.`,
      R`<strong>Softmax</strong> $P(k|x)=e^{s_k}/\sum_je^{s_j}$ (scores = unnormalised log-probabilities; adding a constant to all scores changes nothing). <strong>Cross-entropy</strong> $L_i=-\log P(y_i|x_i)$, gradient $\partial L_i/\partial s=p-\mathbb{1}_{y_i}$. Range $[0,\infty)$; at init $\approx\log C$ (2.3 for 10 classes).`,
      R`Hinge stops caring once the margin is met; cross-entropy always pushes the correct probability towards 1.`,
    ],
    mcq: [
      { pts: 1, k: "compute", q: R`With $\Delta=1$, SGD is run on a two-class hinge loss $J=\max(0,\,1-s_y+s_j)$, where $s_y$ is the correct-class score and $s_j$ the wrong-class score. For which cases is there <em>no update</em>?`,
        o: [R`$(s_y,s_j)=(3,\,1.5)$`, R`$(s_y,s_j)=(2,\,1.2)$`, R`$(s_y,s_j)=(0.5,\,-1)$`, R`$(s_y,s_j)=(1,\,0.5)$`], a: [0, 2],
        x: R`No update iff $s_y-s_j\ge1$: margins are 1.5 ✓, 0.8 ✗ (loss 0.2), 1.5 ✓, 0.5 ✗ (loss 0.5). Correctly classified samples (b, d) still produce gradient when inside the margin.` },
      { pts: 1, single: true, k: "compute", q: R`Scores for a cat image are cat 3.2, car 5.1, frog −1.7 (correct: cat). What is the hinge loss with $\Delta=1$?`,
        o: [R`0`, R`1.9`, R`2.9`, R`3.9`], a: [2],
        x: R`$\max(0,5.1-3.2+1)+\max(0,-1.7-3.2+1)=2.9+0=2.9$. The frog term is negative inside the max (note the sign: $s_j-s_{y_i}$).` },
      { pts: 2, k: "compute", q: R`For the same cat image (scores cat 3.2, car 5.1, frog −1.7), which statements about the gradient of the hinge loss with respect to the scores are true?`,
        o: [R`$\partial L/\partial s_{\text{car}}=1$`, R`$\partial L/\partial s_{\text{frog}}=0$`, R`$\partial L/\partial s_{\text{cat}}=-1$`, R`$\partial L/\partial s_{\text{cat}}=-2$`], a: [0, 1, 2],
        x: R`Only car violates the margin. Each violator contributes $+1$ to its own score and $-1$ to the correct score; frog is outside the margin, so its gradient is 0.` },
      { pts: 1, k: "scenario", q: R`You implement a softmax classifier for CIFAR-10 (10 classes) with small random weights and see an initial loss of 9.0. Which statements are true?`,
        o: [R`The expected initial cross-entropy is about 2.3`, R`Something is likely wrong — e.g. weights not small, a missing normalisation, or a hinge-style sum computed instead`, R`9.0 is the expected initial value of the multi-class hinge loss for 10 classes`, R`The loss is fine because cross-entropy has no upper bound`], a: [0, 1, 2],
        x: R`Sanity check: CE ≈ $\log10\approx2.3$, hinge ≈ $C-1=9$. A mismatch with the expected value is a cheap bug detector.` },
      { pts: 2, k: "trap", q: R`$W$ achieves zero hinge loss on the training set (no regularization). Which statements are true?`,
        o: [R`$2W$ also achieves zero hinge loss`, R`$0.5W$ is guaranteed to achieve zero hinge loss`, R`$W$ and $2W$ make identical class predictions on every input (ignoring the bias)`, R`Adding $\lambda\lVert W\rVert^2$ makes the objective prefer $W$ over $2W$`], a: [0, 2, 3],
        x: R`Scaling by $\alpha>1$ only grows margins; halving can push margins below $\Delta$. Scaling does not change the argmax. L2 regularization breaks the tie in favour of smaller weights.` },
      { pts: 1, k: "scenario", q: R`A softmax classifier with L2 regularization has <strong>high training error</strong>, and validation error is about the same. Which are promising things to try?`,
        o: [R`Decrease the regularization strength $\lambda$`, R`Use a more expressive model (e.g. add hidden layers)`, R`Increase $\lambda$`, R`Collect more training data`], a: [0, 1],
        x: R`High training error ≈ validation error means underfitting (high bias). Reduce the constraint or increase capacity. More data and a larger $\lambda$ fight overfitting, not underfitting.` },
      { pts: 1, k: "trap", q: R`Scores are $s=[2,1,0]$. Which changes leave the softmax probabilities <em>unchanged</em>?`,
        o: [R`Adding 100 to every score`, R`Subtracting $\max_j s_j$ from every score`, R`Multiplying every score by 2`, R`Adding 1 only to the correct class's score`], a: [0, 1],
        x: R`Softmax is shift-invariant ($e^{s+c}$ cancels), which is why implementations subtract the max for numerical stability. Scaling sharpens the distribution.` },
      { pts: 1, single: true, k: "compute", q: R`A 3-class softmax outputs $p=[0.7,\,0.2,\,0.1]$ and the true class is the <em>second</em>. What is $\partial L/\partial s$ for cross-entropy?`,
        o: [R`$[0.7,\,-0.8,\,0.1]$`, R`$[-0.3,\,0.2,\,0.1]$`, R`$[0.7,\,0.2,\,0.1]$`, R`$[0,\,-0.8,\,0]$`], a: [0],
        x: R`$\partial L/\partial s=p-y$ with $y=[0,1,0]$. The wrong classes are pushed down in proportion to their probability; the correct one up by $1-p_y$.` },
      { pts: 2, k: "interpret", q: R`Input $x=[1,1,1,1]$, $W_1=[1,0,0,0]$, $W_2=[0.25,0.25,0.25,0.25]$. Which statements are true?`,
        o: [R`Both give the same score $W\cdot x=1$`, R`L1 regularization cannot distinguish $W_1$ from $W_2$`, R`L2 regularization prefers $W_2$, which uses all inputs and is more robust if one pixel is corrupted`, R`L1 regularization generally tends to produce dense weights like $W_2$`], a: [0, 1, 2],
        x: R`L1: both 1. L2: $W_1$ gives 1, $W_2$ gives 0.25. L1 tends to produce sparse solutions like $W_1$.` },
      { pts: 1, k: "interpret", q: R`How do hinge loss and cross-entropy behave on a sample that is already correctly classified with a large margin?`,
        o: [R`Hinge loss is exactly 0 and contributes no gradient`, R`Cross-entropy is small but positive, and still pushes the correct score up`, R`Both losses are exactly 0`, R`Cross-entropy can become negative for very confident predictions`], a: [0, 1],
        x: R`$-\log p$ reaches 0 only when $p=1$, which requires infinite margin; it is never negative.` },
    ],
    short: [
      { pts: 2, k: "interpret", q: R`Why check the loss at initialisation? What values do you expect for hinge loss and cross-entropy with $C$ classes, and why?`,
        a: R`<p>With tiny random weights all scores are ≈ 0. Hinge: each of the $C-1$ wrong classes contributes $\max(0,0-0+1)=1$, so $L\approx C-1$. Cross-entropy: softmax is uniform, $p_y=1/C$, so $L\approx\log C$. If the first measured loss differs a lot, the implementation (or initialisation) is wrong — a free sanity check before training.</p>` },
      { pts: 2, k: "interpret", q: R`In cross-entropy only $-\log p_{y_i}$ appears. A student says "so the wrong classes are ignored". Is that right? Explain using the gradient.`,
        a: R`<p>No. $p_{y_i}=e^{s_{y_i}}/\sum_je^{s_j}$ depends on <em>all</em> scores through the normalisation; if $p_{\text{cat}}=0.13$, that is because 87% went to other classes. The gradient $\partial L/\partial s_j=p_j$ for $j\ne y_i$ is non-zero for every wrong class, pushing each down in proportion to its probability.</p>` },
      { pts: 2, k: "interpret", q: R`Does the specific margin $\Delta=1$ matter? What if the scores range up to 1000?`,
        a: R`<p>Not much. Without regularization, scaling $W$ (and hence the scores) can make any positive margin satisfied, so $\Delta$ only fixes the scale of $W$. With regularization, $\Delta$ and $\lambda$ trade off against each other — changing $\Delta$ is equivalent to rescaling $\lambda$ — so in practice $\Delta=1$ is a convention and $\lambda$ is tuned.</p>` },
      { pts: 2, k: "scenario", q: R`All 40 students train the same linear classifier on the same data and all reach zero training loss. Will their weights be the same? How should one model be chosen?`,
        a: R`<p>No. Random initialisation and mini-batch shuffling give different solutions, and zero-loss solutions are not unique ($W$, $2W$, …). Choose by <strong>validation</strong> accuracy (never the test set). Regularization also expresses a preference — among models that fit, prefer smaller, smoother weights.</p>` },
      { pts: 2, k: "interpret", q: R`Compare the squared hinge loss $\max(0,s_j-s_{y_i}+1)^2$ with the standard hinge loss. When might you prefer each?`,
        a: R`<p>Both have the same zero region. Squaring makes small violations (&lt;1) contribute less and large violations much more, so training concentrates on badly misclassified samples and the loss is differentiable at the hinge. Standard hinge is more tolerant of outliers (linear growth). Pick by validation; the lecture's point is that both are valid losses with different training dynamics.</p>` },
    ],
    long: [
      { pts: 8, k: "compute", q: R`<p>A 3-class classifier (cat, dog, ship) produces these scores:</p>
<table><tr><th>Image (true class)</th><th>cat</th><th>dog</th><th>ship</th></tr>
<tr><td>1 (cat)</td><td>2</td><td>1</td><td>−1</td></tr>
<tr><td>2 (dog)</td><td>3</td><td>2.5</td><td>0</td></tr>
<tr><td>3 (ship)</td><td>1</td><td>2</td><td>0.5</td></tr></table>`,
        parts: [
          { pts: 2, q: R`Compute the hinge loss ($\Delta=1$) of each image and the average loss.`,
            a: R`<p>Image 1: $\max(0,1-2+1)+\max(0,-1-2+1)=0+0=0$.<br>Image 2: $\max(0,3-2.5+1)+\max(0,0-2.5+1)=1.5+0=1.5$.<br>Image 3: $\max(0,1-0.5+1)+\max(0,2-0.5+1)=1.5+2.5=4.0$.<br>Average $=5.5/3\approx1.83$.</p>` },
          { pts: 2, q: R`Image 1 is correctly classified with exactly zero hinge loss. Is any of its scores "safe"? Compute its hinge gradient with respect to the scores, and explain what happens if the dog score rises to 1.5.`,
            a: R`<p>The dog margin is exactly $2-1=1$ (on the boundary), ship's is 3. The gradient is 0 for all scores (at the kink, use the zero sub-gradient). If $s_{\text{dog}}$ becomes 1.5, the margin is 0.5 &lt; 1: loss $=0.5$ and the gradient becomes $\partial L/\partial s_{\text{dog}}=+1$, $\partial L/\partial s_{\text{cat}}=-1$, even though the image is still correctly classified.</p>` },
          { pts: 2, q: R`For image 2, compute the softmax probabilities, the cross-entropy loss and $\partial L/\partial s$.`,
            a: R`<p>$e^3=20.09$, $e^{2.5}=12.18$, $e^0=1$; sum $=33.27$. $p=[0.604,\,0.366,\,0.030]$. Loss $=-\ln0.366\approx1.00$. Gradient $p-y=[0.604,\,-0.634,\,0.030]$: push cat down most, dog up.</p>` },
          { pts: 2, q: R`Doubling $W$ doubles all of image 1's scores to $[4,2,-2]$. How do its hinge loss and cross-entropy change, and which term of the full objective discourages this?`,
            a: R`<p>Hinge stays 0. Cross-entropy: before, $p_{\text{cat}}=e^2/(e^2+e+e^{-1})=7.39/10.48\approx0.705$, loss $\approx0.35$; after, $p=54.6/(54.6+7.39+0.14)\approx0.879$, loss $\approx0.13$. So CE alone always rewards growing $W$ on separable data. The regularizer $\lambda\lVert W\rVert^2$ grows 4× when $W$ doubles and stops the weights from growing without bound.</p>` },
        ] },
    ],
  };
})();
