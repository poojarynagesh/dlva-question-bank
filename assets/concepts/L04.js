(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L04"] = [
    { h: R`Loss, happy and unhappy`, t: "def", b: R`<p>Scores are $s=f(x_i,W)=Wx_i+b$. Correct class has the highest score $\Rightarrow$ <em>happy</em>, zero loss. Otherwise <em>unhappy</em>, positive loss. The loss compares the prediction with the ground-truth label $y_i$ (from human annotators).</p>
$$L=\frac1N\sum_{i=1}^{N}L_i\big(f(x_i,W),y_i\big).$$` },
    { h: R`Multi-class SVM (hinge) loss`, t: "exam", b: R`<p>The correct class must beat every other class by at least a margin $\Delta$ (usually 1):</p>
$$L_i=\sum_{j\neq y_i}\max\big(0,\;s_j-s_{y_i}+\Delta\big).$$
<p>Hinge shape: flat at 0 once the margin is met, then linear. The loss stops caring once the margin is satisfied.</p>
<p><strong>Worked example</strong> (3 classes: cat, car, frog):</p>
<table><tr><th>Image</th><th>scores (cat, car, frog)</th><th>$L_i$</th></tr>
<tr><td>cat</td><td>3.2, 5.1, -1.7</td><td>$\max(0,5.1-3.2+1)+\max(0,-1.7-3.2+1)=2.9+0=2.9$</td></tr>
<tr><td>car</td><td>1.3, 4.9, 2.0</td><td>$\max(0,1.3-4.9+1)+\max(0,2.0-4.9+1)=0+0=0$</td></tr>
<tr><td>frog</td><td>2.2, 2.5, -3.1</td><td>$\max(0,2.2+3.1+1)+\max(0,2.5+3.1+1)=6.3+6.6=12.9$</td></tr></table>
$$L=\frac{2.9+0+12.9}{3}\approx 5.27.$$
<p>Careful with the sign: it is $s_j-s_{y_i}$, so the frog row uses $2.2-(-3.1)$ (a student caught the professor writing $+3.2$ in class).</p>` },
    { h: R`SVM-loss edge cases the professor asked`, t: "exam", b: R`<ul>
<li><strong>Sum over all classes including $y_i$</strong>: the extra term is $s_{y_i}-s_{y_i}+1=1$, a constant (DC) offset; the minimum becomes 1 instead of 0. Optimisation is unchanged.</li>
<li><strong>Mean instead of sum</strong>: just a constant scale, no effect on the minimiser.</li>
<li><strong>Squared hinge</strong> $\max(0,\cdot)^2$: also valid; like L2 versus L1 it punishes big violations more and small ones less, so dynamics differ.</li>
<li><strong>Range</strong>: $[0,+\infty)$.</li>
<li><strong>$\Delta$</strong>: arbitrary by convention; its absolute value is tied to the scale of the scores and of $W$, which regularisation also controls.</li>
<li><strong>Initial loss</strong>: $W\approx0\Rightarrow$ all $s\approx0$, each of the $C-1$ terms is $\approx\Delta=1$, so $L\approx C-1$ (9 for 10 classes, 999 for 1000). Far from this means a bug.</li>
<li><strong>Non-unique $W$</strong>: if $W$ gives zero loss so does $2W$ (margins only grow), hence infinitely many solutions. Different seeds and different batch order give different $W$ too.</li></ul>` },
    { h: R`Regularisation`, t: "def", b: R`$$L=\underbrace{\frac1N\sum_i L_i}_{\text{data loss}}+\lambda\,R(W).$$
<p>$R(W)$ depends on $W$ only (not on the data); $\lambda$ is a hyperparameter trading fit against simplicity. It breaks the tie between the many zero-loss solutions by preferring small, simple weights (Occam), improves stability and generalisation. It is optional but recommended, is recomputed every iteration, and costs "just a sum" compared with the rest of training.</p>
<table><tr><th>Type</th><th>$R(W)$</th><th>Effect</th></tr>
<tr><td>L1</td><td>$\sum|W_{kl}|$</td><td>sparse weights, feature selection</td></tr>
<tr><td>L2</td><td>$\sum W_{kl}^2$</td><td>small, spread-out weights</td></tr>
<tr><td>Elastic net</td><td>$\alpha\,\text{L1}+(1-\alpha)\,\text{L2}$</td><td>mix</td></tr>
<tr><td>Max norm</td><td>cap on any weight</td><td>bounded weights</td></tr></table>` },
    { h: R`L1 versus L2: the professor's four-pixel example`, t: "exam", b: R`<p>Input $x=[1,1,1,1]$. Take $W_1=[1,0,0,0]$ and $W_2=[0.25,0.25,0.25,0.25]$. Both give $W\cdot x=1$ (same score).</p>
<table><tr><th></th><th>$W_1$</th><th>$W_2$</th></tr>
<tr><td>L1 penalty</td><td>$1$</td><td>$4\times0.25=1$</td></tr>
<tr><td>L2 penalty</td><td>$1$</td><td>$4\times0.0625=0.25$</td></tr></table>
<p>L1 cannot tell them apart; L2 prefers the spread-out $W_2$. Hence:</p>
<ul><li><strong>L1</strong>: sparse, relies on a few features, so no fault tolerance if one is corrupted.</li>
<li><strong>L2</strong>: dense, every feature participates, so more robust to noise; generally preferred in deep learning.</li></ul>` },
    { h: R`Softmax and cross-entropy`, t: "exam", b: R`<p>Treat scores as <em>unnormalised log-probabilities</em>: exponentiate, then normalise.</p>
$$P(Y=k\mid x_i)=\frac{e^{s_k}}{\sum_{j=1}^{C}e^{s_j}},\qquad L_i=-\log P(Y=y_i\mid x_i).$$
<p>Outputs are positive and sum to 1. The loss uses <strong>only the correct class</strong> probability; the others enter through the denominator. $-\log$ gives 0 at $P=1$ and $\to\infty$ as $P\to0$.</p>
<p><strong>Worked example</strong> (cat image, scores 3.2, 5.1, -1.7): $e^{3.2}=24.5$, $e^{5.1}=164.0$, $e^{-1.7}=0.18$, sum $=188.7$. So $P(\text{cat})\approx0.13$, $P(\text{car})\approx0.87$, $P(\text{frog})\approx0.001$, and</p>
$$L_1=-\log(0.13)\approx 2.04.$$
<p>Take $-\log$ of the correct class (cat), not of the winner (car). If $P=0.98$ the loss would be only $0.02$.</p>
<p><strong>Initial loss</strong> at $W\approx0$: $P=1/C$ so $L=\log C$ (about 2.3 for 10 classes, 6.9 for 1000). Range $[0,+\infty)$.</p>` },
    { h: R`SVM versus cross-entropy`, t: "exam", b: R`<table><tr><th></th><th>SVM / hinge</th><th>Cross-entropy</th></tr>
<tr><td>Formula</td><td>$\sum_{j\ne y}\max(0,s_j-s_y+\Delta)$</td><td>$-\log\frac{e^{s_y}}{\sum_j e^{s_j}}$</td></tr>
<tr><td>Interprets scores as</td><td>raw scores</td><td>probabilities</td></tr>
<tr><td>When satisfied</td><td>loss exactly 0 once margin met</td><td>never fully satisfied, always pushes $P\to1$</td></tr>
<tr><td>Initial loss, random $W$</td><td>$\approx C-1$</td><td>$\approx\log C$</td></tr>
<tr><td>Aliases</td><td>max-margin loss</td><td>log loss, negative log-likelihood</td></tr></table>
<p>The professor: cross-entropy is "at the heart of data-driven models". It underlies CNNs, transformers and LLMs.</p>` },
    { h: R`Common traps`, t: "pitfall", b: R`<ul>
<li><strong>Softmax is a function</strong> (scores to probabilities); <strong>cross-entropy is the loss</strong> applied after it. "Softmax loss" is loose language.</li>
<li>Putting $-\log$ of the <em>largest</em> probability instead of the correct class.</li>
<li>Sign error $s_j-s_{y_i}$ versus $s_{y_i}-s_j$ in the hinge.</li>
<li>Expecting zero loss from cross-entropy: it only approaches 0 as $P\to1$.</li>
<li>Believing a zero-loss $W$ is unique; $\alpha W$ ($\alpha>1$) is also zero-loss, which is exactly why regularisation is needed.</li>
<li>Choosing among zero-loss models with the test set: use validation accuracy.</li>
<li>Confusing the two initial-loss sanity checks: hinge $C-1$, cross-entropy $\log C$.</li></ul>` },
  ];
})();
