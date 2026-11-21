(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L14"] = [
    { h: R`Attacking the input, not the weights`, t: "def", b: R`
<p>Training uses $\nabla_\theta J$ to <em>decrease</em> loss. An <strong>adversarial attack</strong> freezes $\theta$ and moves the <em>input</em> to <em>increase</em> loss. The input gradient $\nabla_xJ(\theta,x,y)$ has the image's shape; each entry says how one pixel/channel changes the loss.</p>
<p>$$x^*=x+\delta,\qquad \lVert\delta\rVert_\infty\le\epsilon$$</p>
<p>Typical budget $\epsilon=8/255$ ($4/255$ for some larger models): small enough to be near or below human perception.</p>
<ul>
<li><strong>Untargeted</strong>: make the model predict any wrong class (increase loss of the true class).</li>
<li><strong>Targeted</strong>: force a chosen class (reduce the target class's loss).</li>
<li><strong>White-box</strong>: full access to parameters and gradients. <strong>Black-box transfer</strong>: craft on a surrogate, test on another model.</li>
<li><strong>Fooling rate</strong> = fraction of inputs whose prediction flips.</li>
</ul>` },

    { h: R`FGSM and PGD`, t: "exam", b: R`
<p><strong>FGSM</strong> (one step):</p>
<p>$$x_{\text{adv}}=\operatorname{clip}_{[0,1]}\big(x+\epsilon\operatorname{sign}(\nabla_xJ)\big)$$</p>
<p><strong>PGD</strong> (iterate, then project back into the $\epsilon$-ball around the clean $x$):</p>
<p>$$x^{t+1}=\Pi_{B_\epsilon(x)}\big(x^t+\alpha\operatorname{sign}(\nabla_{x^t}J)\big)$$</p>
<p><em>Numbers.</em> A pixel of 0.50 with positive gradient sign and $\epsilon=8/255\approx0.0314$ becomes 0.531; a pixel at 0.99 is clipped to 1.0. For PGD with $K=10$ steps, $\alpha\approx\epsilon/10=0.8/255$ per step; if an iterate drifts to more than $\epsilon$ from the clean pixel, projection (clamping to $[x-\epsilon,x+\epsilon]$) pulls it back.</p>
<table>
<tr><th></th><th>FGSM</th><th>PGD-$K$</th></tr>
<tr><td>Steps</td><td>1 backward pass</td><td>$K$ backward passes</td></tr>
<tr><td>Strength</td><td>weaker</td><td>much stronger</td></tr>
<tr><td>Training on it</td><td>cheap, but gradient masking / catastrophic overfitting</td><td>smooth loss landscape, robust, about 10 to 11 times cost for $K=10$</td></tr>
</table>` },

    { h: R`Universal adversarial perturbations (UAPs)`, t: "def", b: R`
<p>Image-specific attacks compute a new $\delta(x)$ per image. A <strong>UAP</strong> is one fixed $\delta$ that fools many images of many classes:</p>
<p>$$\Pr_{x\sim\mathcal D}\big(f(x+\delta)\ne f(x)\big)\ge1-\xi,\qquad\lVert\delta\rVert_p\le\epsilon$$</p>
<p>It is image-agnostic but model-dependent. Lecture figures: white-box (same model) fooling rate about 90%; black-box transfer to other architectures about 40 to 50%, higher between related nets (VGG-16 and VGG-19). ResNet-152 showed a lower white-box fooling rate (somewhat more robust in that experiment) yet its perturbations transferred well; the professor warned this is not a universal ranking.</p>
<p><strong>Diverse perturbations</strong>: a single known UAP could be estimated and subtracted, so train a generator with a <em>fooling loss</em> (fool the fixed victim) plus a <em>diversity loss</em> (different latent codes give different $\delta$). Interpolations $\delta(\lambda)=(1-\lambda)\delta_1+\lambda\delta_2$ still fool about 87 to 88%, so effective perturbations form a broad manifold (millions of attacks).</p>` },

    { h: R`Data-free attacks: class impressions`, t: "def", b: R`
<p>Problem: craft a UAP when the training data is private. Idea: use the model itself. Freeze weights, start from random noise, pick class $c$, optimise the pixels:</p>
<p>$$x_{t+1}=x_t-\eta\nabla_x\big[-\log p_\theta(c\mid x_t)\big]$$</p>
<p>The result, a <strong>class impression</strong> (proxy image), may look unnatural but strongly activates class $c$ and shows recognisable features (butterfly wing spots, spider legs, goldfish orange shapes). Different random starts and stopping thresholds give several per class (about 10 to 50). Use them in place of training images to craft UAPs. Reported: white-box fooling about 60 to 90% (architecture dependent), black-box often above 50%, because impressions capture transferable class features, not one instance.</p>
<p>Side use: recover what a forgotten numeric class ID means by optimising it and looking at the image. You cannot recover exact training images.</p>
<p>Task-independent perturbations extend the idea to disturb detection and segmentation too, removing dependence on labelled data and on a specific task loss (details not covered).</p>` },

    { h: R`Defences and adversarial training`, t: "exam", b: R`
<p><strong>Preprocessing</strong> (blur, bit-depth reduction, JPEG) is not a reliable standalone defence: adaptive attacks differentiate through or approximate it (BPDA).</p>
<p><strong>Adversarial training</strong> is a min-max problem:</p>
<p>$$\min_\theta\ \mathbb E_{(x,y)}\Big[\max_{\lVert\delta\rVert_p\le\epsilon}J(\theta,x+\delta,y)\Big]$$</p>
<p>Inner max = craft the worst-case example (PGD); outer min = update the weights. Early versions mixed half clean and half adversarial per mini-batch; strong PGD training can use an all-adversarial batch. How an example is generated (PGD) and how the batch is composed are separate choices.</p>
<p><em>Cost.</em> PGD-10 needs about 10 attack backward passes plus the training pass, about 10 to 11 times normal cost: a 4-day run becomes roughly 40 to 45 days. Result: robust accuracy only about 50%, and clean accuracy drops (about 82%, a drop of around 10 points). The persistent trade-off is clean accuracy vs robust accuracy vs compute.</p>` },

    { h: R`Fast adversarial training and catastrophic overfitting`, t: "exam", b: R`
<p>FGSM-only adversarial training is cheap but can suddenly fail: the model looks robust to FGSM yet collapses against PGD (<strong>catastrophic overfitting</strong>, a form of <strong>gradient masking</strong>: apparent robustness from unusable gradients, not true robustness). It often appears after tens of epochs.</p>
<p><strong>R-FGSM</strong> first adds a small random perturbation, then takes an FGSM step with the remaining budget. In healthy training FGSM and R-FGSM examples stay close; under catastrophic overfitting their $L_2$ distance and loss diverge sharply. So regularise them to agree on logits $z$:</p>
<p>$$\mathcal L=\mathcal L_{\text{CE}}(f(x_{\text{FGSM}}),y)+\lambda\lVert z(x_{\text{FGSM}})-z(x_{\text{R-FGSM}})\rVert_2^2$$</p>
<p>Reported: about 46% against PGD-20 vs about 47.5% for full PGD training, with one attack backward pass (about twice normal training cost).</p>` },

    { h: R`Adversary-free defence: bit planes and quantisation`, b: R`
<p>An 8-bit pixel is $v=\sum_{i=0}^{7}b_i2^i$. High planes carry coarse structure ($2^7=128$); low planes carry fine variation. <em>Example</em>: $187=128+32+16+8+2+1=10111011_2$; dropping the 3 lowest planes gives $10111000_2=184$. An $8/255$ perturbation has magnitude $2^3$, so it acts mainly in the lower planes; changing high bits would visibly corrupt the image and lies outside the imperceptible threat model.</p>
<p><strong>Randomised quantisation</strong>: choose about 0 to 5 low planes at random (optionally add small noise) and quantise to $Q(x)$. Train with <strong>consistency regularisation</strong>:</p>
<p>$$\mathcal L=\mathcal L_{\text{task}}+\lambda\lVert g(x)-g(Q(x))\rVert$$</p>
<p>No attack is generated (no attack backward pass, only an extra forward path). Robustness about 30%, below adversarial training's about 50%, at much lower cost. Increasing $\lambda$ helps only up to a sweet spot and then hurts clean accuracy. Always keep the original image too: removing all low bits could erase small objects. Image quantisation is different from model quantisation (FP16/FP8/binary weights).</p>` },

    { h: R`Common mistakes`, t: "pitfall", b: R`
<ul>
<li>Attacks change the input with fixed weights; they do not retrain the network.</li>
<li>$L_\infty$ with $\epsilon$ bounds every pixel individually; $\operatorname{sign}$ makes every entry move by exactly $\pm\epsilon$ (then clip to $[0,1]$).</li>
<li>PGD is stronger than FGSM because it iterates and projects, not because it uses a larger $\epsilon$.</li>
<li>A UAP is image-agnostic but still model-dependent; transfer is lower across dissimilar architectures.</li>
<li>Good FGSM accuracy after FGSM training does not prove robustness (catastrophic overfitting); evaluate with PGD.</li>
<li>Preprocessing defences fail against adaptive attacks; nothing here gives perfect robustness (about 50% is the best cited).</li>
<li>Robust training lowers clean accuracy; always quote both numbers.</li>
</ul>` },
  ];
})();
