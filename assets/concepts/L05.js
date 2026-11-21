(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L05"] = [
    { h: R`The optimisation problem`, t: "def", b: R`<p>With a score function $f(x,W)=Wx+b$ and about 30,000 parameters (CIFAR-10: $10\times3072$) nobody can set $W$ by hand. Supervised learning supplies a signal: ground-truth labels. We pick $W$ to minimise the total loss:</p>
$$\min_W\;L(W)=\frac1N\sum_{i=1}^{N}L_i\big(f(x_i,W),y_i\big)+\lambda R(W).$$
<p>Recap: hinge loss is zero once the margin is met (higher margin means more robust to small perturbations); cross-entropy never reaches a "satisfied" point. The regulariser sees only $W$, never $x$.</p>` },
    { h: R`Gradient descent`, t: "exam", b: R`<p>Picture the loss as a hilly landscape over parameter space. $\nabla_W L$ points <strong>uphill</strong> (steepest ascent), so we step against it:</p>
$$W_{t+1}=W_t-\alpha\,\nabla_W L(W_t).$$
<p>$\alpha$ = learning rate (step size). The minus sign is what makes it descent. As we walk down, the loss falls and predictions become more correct.</p>
<p><strong>Tiny numeric example</strong>: one weight, $L(w)=w^2$, so $\nabla L=2w$. With $w_0=4$, $\alpha=0.1$: $w_1=4-0.1\cdot8=3.2$, $w_2=3.2-0.1\cdot6.4=2.56$. With $\alpha=1.1$: $w_1=4-1.1\cdot8=-4.8$, $w_2=-4.8+10.56=5.76$, so it overshoots and diverges.</p>
<p>In high dimensions there are many local minima. GD finds <em>a</em> minimum, not necessarily <em>the</em> global one, but many are about as good in practice.</p>` },
    { h: R`Full-batch, SGD and mini-batch`, t: "exam", b: R`<table><tr><th></th><th>Full-batch GD</th><th>SGD (1 sample)</th><th>Mini-batch</th></tr>
<tr><td>Gradient</td><td>$\frac1N\sum_{i=1}^N\nabla L_i$ (exact)</td><td>$\nabla L_i$ for one random $i$</td><td>$\frac1n\sum_{i\in\text{batch}}\nabla L_i$</td></tr>
<tr><td>Stability</td><td>very stable</td><td>very noisy, oscillates</td><td>reasonably stable</td></tr>
<tr><td>Speed per update</td><td>very slow</td><td>very fast</td><td>fast</td></tr>
<tr><td>Memory</td><td>whole dataset</td><td>minimal</td><td>manageable</td></tr>
<tr><td>Updates per epoch (CIFAR-10)</td><td>1</td><td>50,000</td><td>about 195</td></tr></table>
<p>Mini-batch is the practical standard: batch size usually a power of 2 (32 ... 512), limited by <strong>GPU memory</strong>; AlexNet used 256. There is no formula for the best batch size. A random batch of 256 from 10 classes contains roughly 25-30 images per class, so it represents all classes.</p>` },
    { h: R`Epoch, batch, iteration`, t: "def", b: R`<ul><li><strong>Epoch</strong>: one full pass through the training set.</li>
<li><strong>Batch</strong>: the subset used for one gradient computation.</li>
<li><strong>Iteration</strong>: one parameter update, i.e. one batch processed.</li></ul>
<p>Worked: $N=50{,}000$, batch 256: $50000/256=195.3$, so about 195 full batches (196 if the last, smaller batch is kept) $\Rightarrow$ about 195 iterations per epoch. Over 100 epochs that is roughly $19{,}500$ updates and each sample is seen 100 times. Batches are non-overlapping; within an epoch each sample appears once.</p>
<p>Check with batch 100: $50000/100=500$ iterations per epoch; with batch 1: 50,000; with batch 50,000: 1.</p>` },
    { h: R`Learning rate`, t: "exam", b: R`<p>The most critical hyperparameter. Typical range quoted: $10^{-3}$ to $10^{-4}$.</p>
<table><tr><th>$\alpha$</th><th>Behaviour</th></tr>
<tr><td>too high (the professor's example: 0.01)</td><td>overshoots the minimum, oscillates, loss diverges or explodes</td></tr>
<tr><td>too low (about $10^{-6}$)</td><td>very slow decrease, may stall in a poor minimum</td></tr>
<tr><td>just right</td><td>smooth convergence to a good minimum</td></tr></table>
<p>There is <strong>no formula</strong>; it is trial and error, usually starting from the defaults of established architectures, because experiments are expensive. It depends on architecture, data and optimiser.</p>` },
    { h: R`Reading loss curves`, b: R`<ul>
<li>Within an epoch the loss is noisy because each batch differs. Judge the <strong>trend over 4-5 epochs</strong>, not single steps.</li>
<li>After about 100 epochs the CIFAR-10 example reaches a loss around 0.6-0.7.</li>
<li>Loss keeps rising: learning rate too high (diverging).</li>
<li>Flat from the start: learning rate too small, or the model too simple.</li>
<li>Wild oscillation without trend: batch too small or learning rate too high.</li></ul>
<p>Regularisation matters here too: without it many $W$ give zero data loss; with it we prefer the small-weight ones.</p>` },
    { h: R`Common traps`, t: "pitfall", b: R`<ul>
<li>Moving <em>along</em> the gradient instead of against it (sign error $W+\alpha\nabla L$).</li>
<li>"SGD" in the lecture means one sample per update; in practice people say SGD for mini-batch too, so read the batch size.</li>
<li>Counting updates: full-batch = 1 per epoch, SGD = $N$ per epoch, mini-batch = $N/n$ per epoch.</li>
<li>Panicking at one rising loss value; look at the multi-epoch trend.</li>
<li>Expecting the largest batch to be best: the limit is GPU memory, and the choice is empirical.</li>
<li>Thinking GD finds the global minimum, or that a formula exists for the learning rate.</li></ul>` },
  ];
})();
