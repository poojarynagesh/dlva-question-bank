// The DS265o midterm (22 Sep 2026) transcribed, with worked solutions.
(function () {
  const R = String.raw;
  const RNN_UNIT = R`<figure class="diagram"><svg viewBox="0 0 260 190" width="260" role="img" aria-label="Single RNN unit: x feeds h with weight w1, h feeds back to itself with weight w2 and bias b2, h feeds y with weight w3 and bias b3">
<defs><marker id="sa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<g fill="none" stroke="currentColor" stroke-width="1.6">
<circle cx="100" cy="30" r="17"/><circle cx="100" cy="95" r="17"/><circle cx="100" cy="160" r="17"/>
<line x1="100" y1="143" x2="100" y2="114" marker-end="url(#sa)"/><line x1="100" y1="78" x2="100" y2="49" marker-end="url(#sa)"/>
<path d="M116,88 C150,70 150,120 118,101" marker-end="url(#sa)"/></g>
<g font-size="14" text-anchor="middle" fill="currentColor"><text x="100" y="35" font-weight="700">y</text><text x="100" y="100" font-weight="700">h</text><text x="100" y="165" font-weight="700">x</text></g>
<g font-size="12" fill="currentColor"><text x="40" y="66">weight w₃</text><text x="40" y="133">weight w₁</text><text x="122" y="32">bias b₃</text><text x="150" y="90">weight w₂</text><text x="150" y="105">bias b₂</text></g></svg>
<figcaption>A single RNN unit as a state machine ($x_t$, $h_t$, $y_t$ scalars).</figcaption></figure>`;
  const MAP_PLOT = R`<figure class="diagram"><svg viewBox="0 0 260 245" width="260" role="img" aria-label="Plot of h(t+1) = sigmoid(3 h(t) - 1) against h(t), crossing the diagonal at 0.8">
<g stroke="currentColor" fill="none"><rect x="40" y="10" width="200" height="200" stroke-width="1"/>
<line x1="40" y1="210" x2="240" y2="10" stroke-dasharray="4 4" stroke-width="1.2"/>
<path d="M40.0,156.2L50.0,150.1L60.0,143.6L70.0,136.8L80.0,129.7L90.0,122.4L100.0,115.0L110.0,107.5L120.0,100.0L130.0,92.7L140.0,85.5L150.0,78.6L160.0,72.0L170.0,65.8L180.0,59.9L190.0,54.5L200.0,49.6L210.0,45.0L220.0,40.9L230.0,37.2L240.0,33.8" stroke-width="2.2" stroke="var(--chap, var(--accent))"/></g>
<circle cx="200" cy="50" r="4" fill="var(--chap, var(--accent))"/>
<g font-size="11" fill="currentColor"><text x="150" y="40">(0.80, 0.80)</text><text x="36" y="226" text-anchor="middle">0</text><text x="140" y="226" text-anchor="middle">0.5</text><text x="240" y="226" text-anchor="middle">1</text><text x="32" y="213" text-anchor="end">0</text><text x="34" y="113" text-anchor="end">0.5</text><text x="32" y="15" text-anchor="end">1</text>
<text x="140" y="242" text-anchor="middle">hₜ</text><text x="12" y="110" text-anchor="middle" transform="rotate(-90 12 110)">hₜ₊₁</text><text x="160" y="170">hₜ₊₁ = hₜ</text></g></svg>
<figcaption>$h_{t+1}=\sigma(3h_t-1)$ (solid) against the diagonal $h_{t+1}=h_t$ (dashed); they cross at 0.80.</figcaption></figure>`;

  (window.QB_ALL = window.QB_ALL || {})["sample"] = {
    id: "sample",
    points: [
      R`Closed book, <strong>30 marks</strong>, 90 minutes.`,
      R`MCQs have <strong>at least one correct option</strong> unless stated otherwise; partial marks for an incomplete but correct selection.`,
      R`Short questions: make your reasoning clear and to the point.`,
      R`Sections: MCQs (14 marks, Q1–11), short questions (8 marks, Q12–15), one long multi-part question (8 marks, Q16).`,
    ],
    mcq: [
      { pts: 1, q: R`Your model for classifying different dog species is getting a high training set error. Which of the following are promising things to try to improve your classifier?`,
        o: [R`Use a bigger neural network.`, R`Get more training data.`, R`Increase the regularization parameter $\lambda$.`, R`Decrease the probability parameter $p$ in dropout layer (assume the classifier has dropout layers).`], a: [0, 3],
        x: R`High <em>training</em> error = underfitting (high bias): increase capacity or reduce regularization. Here $p$ is the drop probability (as in PyTorch's <code>nn.Dropout(p)</code>), so decreasing it means less regularization. More data and a larger $\lambda$ address overfitting (high variance), not high training error. (If $p$ meant keep probability, the answer for (d) would flip — state your convention in the exam.)` },
      { pts: 1, single: true, q: R`If your input image is $64\times64\times16$, how many parameters are there in a single $1\times1$ convolution filter, including bias?`,
        o: [R`17`, R`2049`, R`4097`, R`3073`], a: [0],
        x: R`A filter spans all input channels: $1\cdot1\cdot16+1=17$. The spatial size $64\times64$ does not matter.` },
      { pts: 2, q: R`The shape of your input image is $(n_h,n_w,n_c)$. The convolution layer uses a $1\times1$ filter with stride 1 and zero padding. Which of the following statements are correct?`,
        o: [R`You can reduce $n_c$ by using $1\times1$ convolution. However, you cannot change $n_h,n_w$.`, R`You can use a standard maxpooling operation to reduce $n_h,n_w$, but not $n_c$.`, R`You can use a $1\times1$ convolution to reduce $n_h,n_w,n_c$.`, R`You can use maxpooling to reduce $n_h,n_w,n_c$.`], a: [0, 1],
        x: R`With stride 1 a $1\times1$ conv keeps the spatial size and sets the number of channels to the number of filters. Pooling works on each channel separately, so it changes only $n_h,n_w$.` },
      { pts: 1, single: true, q: R`Which of the following is true, given the optimal learning rate?`,
        o: [R`<em>Batch</em> gradient descent is always guaranteed to converge to the global optimum of a loss function.`, R`<em>Stochastic</em> gradient descent is always guaranteed to converge to the global optimum of a loss function.`, R`For convex loss functions, batch gradient descent is guaranteed to eventually converge to the global optimum while stochastic gradient descent is not.`, R`For convex loss functions, neither stochastic gradient descent nor batch gradient descent are guaranteed to converge to the global optimum.`], a: [2],
        x: R`(a) and (b) fail for non-convex losses (local minima). For convex losses, exact gradients with a suitable step converge; SGD with a fixed step keeps fluctuating around the optimum because of gradient noise (it needs a decaying step size).` },
      { pts: 2, q: R`Which of the following is true about the vanishing gradient problem?`,
        o: [R`Tanh is usually preferred over sigmoid because it doesn't suffer from vanishing gradients.`, R`Vanishing gradient causes deeper layers to learn more slowly than earlier layers.`, R`Leaky ReLU is less likely to suffer from vanishing gradients than sigmoid.`, R`None of the above.`], a: [2],
        x: R`(a) Tanh is preferred for being zero-centred with a larger derivative (max 1 vs 0.25), but it still saturates and vanishes. (b) is backwards: gradients shrink as they travel back, so the <em>earlier</em> layers (near the input) learn slowest. (c) Leaky ReLU has slope 1 (or a small non-zero slope) everywhere, so it does not saturate.` },
      { pts: 1, single: true, q: R`What is the main benefit of using Momentum optimization?`,
        o: [R`Simple update rule with minimal hyperparameters.`, R`Helps get weights out of local minima.`, R`Effectively scales the learning rate to act the same amount across all dimensions.`, R`Combines the benefits of multiple optimization methods.`], a: [1],
        x: R`Momentum accumulates a velocity, so it rolls through small bumps and shallow local minima and damps oscillations. (c) describes RMSProp/AdaGrad (per-dimension scaling); (d) describes Adam; momentum adds a hyperparameter, so (a) is wrong.` },
      { pts: 1, single: true, q: R`In which of the following cases will there be <em>no update</em> when doing SGD with a max-margin loss $J=\max(0,\,1-s+s_c)$, where $s$ is the true window score and $s_c$ is the corrupt window score?`,
        o: [R`$(s,s_c)=(1,0.5)$`, R`$(s,s_c)=(2,0.5)$`, R`$(s,s_c)=(1,1.5)$`, R`$(s,s_c)=(2,1.5)$`], a: [1],
        x: R`No update iff $1-s+s_c\le0$, i.e. $s-s_c\ge1$. Margins: 0.5, <strong>1.5</strong>, −0.5, 0.5. Only (b) satisfies the margin; (a) and (d) are correctly ordered but inside the margin, so they still produce a gradient.` },
      { pts: 1, q: R`3D Gaussian Splatting and NeRF:`,
        o: [R`Both are Radiance Field method.`, R`Both are 3D reconstruction method.`, R`NeRF is Radiance Field whereas 3D Gaussian Splatting is not radiance field method.`, R`3D Gaussian Splatting is radiance field whereas NeRF is not radiance field.`], a: [0, 1],
        x: R`Both model view-dependent emitted colour plus density/opacity in 3D and render by alpha compositing — NeRF implicitly (MLP), 3DGS explicitly (Gaussians) — and both reconstruct a 3D scene from posed images for novel-view synthesis.` },
      { pts: 1, single: true, q: R`Consider two Gaussians along the same camera ray. The front Gaussian has opacity $\alpha_1$ and color $c_1$, while the back Gaussian has opacity $\alpha_2$ and color $c_2$. Ignoring other Gaussians, the rendered color is:`,
        o: [R`$\alpha_1c_1+\alpha_2c_2$`, R`$(1-\alpha_1)c_1+\alpha_2c_2$`, R`$\alpha_1c_1+(1-\alpha_1)\alpha_2c_2$`, R`$\alpha_1\alpha_2(c_1+c_2)$`], a: [2],
        x: R`Front-to-back compositing $C=\sum_iT_i\alpha_ic_i$ with $T_1=1$, $T_2=1-\alpha_1$: the back Gaussian only receives the light that the front one lets through.` },
      { pts: 1, single: true, q: R`Given a batch size of $N$ examples, how many negative samples per sample are required by SimCLR?`,
        o: [R`$2N-1$`, R`$2N-2$`, R`1`, R`$N-1$`], a: [1],
        x: R`Two augmentations per image give $2N$ views. For an anchor, exclude itself and its positive partner: $2N-2$ negatives.` },
      { pts: 2, q: R`Consider a simple convolutional neural network with one convolutional layer with $3\times3$ filters applied on an image of $128\times128$ resolution. Which of the following statements is <strong>true</strong> about this network? (Select all that apply.)`,
        o: [R`It is scale invariant.`, R`It is rotation invariant.`, R`It is translation invariant.`, R`All of the above.`], a: [2],
        x: R`Weight sharing means a pattern is detected wherever it appears, which is the translation property the course calls translation invariance. (Strictly, a conv layer is translation <em>equivariant</em> — the feature map shifts with the input; pooling makes it invariant.) Nothing in a $3\times3$ filter handles rescaled or rotated patterns.` },
    ],
    short: [
      { pts: 2, q: R`Why do the layers in a deep neural network architecture need to be non-linear?`,
        a: R`<p>A composition of linear (affine) layers is itself linear: $W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)$. Without nonlinearities, any depth collapses to a single linear layer, which can only represent linear decision boundaries (it cannot solve XOR). Nonlinear activations between layers prevent the collapse, so stacked layers build increasingly complex features — "nonlinearity is what gives the concept of depth".</p>` },
      { pts: 2, q: R`You're solving a binary classification task. The final two layers in your network are a ReLU activation followed by a sigmoid activation. What will happen?`,
        a: R`<p>ReLU outputs are $\ge0$, so the sigmoid's input is never negative and $\hat y=\sigma(\mathrm{ReLU}(z))\ge\sigma(0)=0.5$. With a 0.5 threshold, <strong>every example is classified as the positive class</strong>, and the model can never assign probability below 0.5. For examples with $z\lt0$ the ReLU gradient is 0, so the loss cannot push them down. Use a sigmoid directly on $z$.</p>` },
      { pts: 2, q: R`Consider a dataset $\{x^{(1)},x^{(2)},\dots,x^{(m)}\}$ where each example $x^{(i)}$ contains a sequence of 100 numbers: $x^{(i)}=(x^{(i)}_1,x^{(i)}_2,\dots,x^{(i)}_{100})$. You have a very accurate (but not perfect) model that predicts $x^{(i)}_{t+1}$ from $(x^{(i)}_1,\dots,x^{(i)}_t)$. Given $x^{(i)}_1$, you want to generate $(x^{(i)}_2,\dots,x^{(i)}_{100})$ by repeatedly running your model: predict $\hat x^{(i)}_2$ from $x^{(i)}_1$; predict $\hat x^{(i)}_3$ from $(x^{(i)}_1,\hat x^{(i)}_2)$; …; predict $\hat x^{(i)}_{100}$ from $(x^{(i)}_1,\hat x^{(i)}_2,\dots,\hat x^{(i)}_{99})$. The resulting $\hat x^{(i)}_{100}$ turns out to be very different from the true $x^{(i)}_{100}$. Explain why you think this happened.`,
        a: R`<p>The model was trained (teacher forcing) on <em>true</em> prefixes, but at generation each prediction is fed back as input. Every step adds a small error, and the next prediction is made from an already-perturbed, out-of-distribution input, so errors <strong>compound</strong> over the 99 steps (exposure bias). Even a very accurate one-step model drifts far from the truth by step 100. Remedies: scheduled sampling, training on the model's own rollouts, or noise injection.</p>` },
      { pts: 2, q: R`Rameshwaram Cafe restaurant is trying to build an automated service robot, which involves solving a binary classification task of classifying Uthappam vs. Open Dosa. To achieve this, they design a CNN with a single output neuron. Let the output of this neuron be $z$. The final output of your network, $\hat y$, is given by $\hat y=\sigma(\mathrm{ReLU}(z))$, where $\sigma$ is the sigmoid activation function. The model classifies all inputs with a final value of $\hat y\ge0.5$ as Uthappam images. What could be a potential problem with this kind of an approach?`,
        a: R`<p>$\mathrm{ReLU}(z)\ge0$ ⇒ $\hat y\ge0.5$ for every input, so <strong>every image is classified as Uthappam</strong> — Open Dosa can never be predicted. Moreover, whenever $z\lt0$ the ReLU has zero gradient, so training cannot correct those outputs (the network cannot learn to push Open Dosa probabilities below 0.5). Remove the ReLU before the sigmoid.</p>` },
    ],
    long: [
      { pts: 8, labels: ["(a)", "(b) i.", "(b) ii.", "(b) iii.", "(b) iv.", "(b) v.", "(b) vi."],
        q: R`<p>Recall that a recurrent neural network (RNN) takes in an input vector $x_t$ and a state vector $h_{t-1}$ and returns a new state vector $h_t$ and an output vector $y_t$:</p>
$$h_t=f(w_1x_t+w_2h_{t-1}+b_2),\qquad y_t=g(w_3h_t+b_3),$$
<p>where $f$ and $g$ are activation functions.</p>` + RNN_UNIT,
        parts: [
          { pts: 1, q: R`Suppose that $f$ is a binary threshold unit and $g$ is a linear unit: $f(x)=0$ if $x\lt0$, $f(x)=1$ if $x\ge0$; $g(x)=x$. Fill in weights $(w_1,w_2,w_3)$ and biases $(b_2,b_3)$ so that the RNN initially outputs 0, but as soon as it receives an input of 1, it switches to outputting 1 for all subsequent time steps. For instance, the input 0001010 produces the output 0001111. The hidden unit has an initial value of 0.`,
            a: R`<p>$w_1=1$, $w_2=1$, $b_2=-0.5$, $w_3=1$, $b_3=0$. Check: $h=0,x=0$: $-0.5\lt0$ → $h=0$. $x=1$: $1-0.5\ge0$ → $h=1$. Afterwards $h_{t-1}=1$: $w_2\cdot1-0.5\ge0$ → stays 1 whatever $x$ is. $y_t=h_t$. (Any $b_2\in[-1,0)$ with $w_1,w_2\ge-b_2$ works, e.g. $b_2=-1$.)</p>` },
          { pts: 1, q: R`Now suppose that $f$ is a sigmoid unit and that the input is always 0, with $w_2=3$ and $b_2=-1$, i.e. $h_{t+1}=\sigma(3h_t-1)$. The diagram shows $h_{t+1}=h_t$ when $h_t=0.80$.` + MAP_PLOT + R`Would $h_{t+1}$ be greater than or less than $h_t$ if $h_t=0.5$?`,
            a: R`<p>Greater: $h_{t+1}=\sigma(0.5)\approx0.62\gt0.5$ (the curve lies above the diagonal for $h_t\lt0.8$).</p>` },
          { pts: 1, q: R`Would $h_{t+1}$ be greater than or less than $h_t$ if $h_t=0.9$?`,
            a: R`<p>Less: $h_{t+1}=\sigma(1.7)\approx0.85\lt0.9$ (the curve lies below the diagonal for $h_t\gt0.8$).</p>` },
          { pts: 2, q: R`What would $h_{t+1}$ look like as we take increasingly longer sequences, i.e. $t\to\infty$?`,
            a: R`<p>It converges to the fixed point $h^*\approx0.80$ from any starting value in $[0,1]$: below 0.8 the state increases, above 0.8 it decreases, and the slope at the fixed point is $3h^*(1-h^*)=0.48\lt1$, so the fixed point is stable (attracting). Long sequences therefore "forget" the initial state.</p>` },
          { pts: 1, q: R`For what range of initial values $h_0$ would this network experience exploding gradients for long sequences?`,
            a: R`<p><strong>None.</strong> $\partial h_{t+1}/\partial h_t=3\sigma'(3h_t-1)=3h_{t+1}(1-h_{t+1})\le3\cdot0.25=0.75\lt1$ for every state, so a product of such factors can never grow.</p>` },
          { pts: 1, q: R`For what range of initial values $h_0$ would this network experience vanishing gradients for long sequences?`,
            a: R`<p><strong>All</strong> $h_0$. Every factor is at most 0.75 and near the fixed point it is 0.48, so $\partial h_T/\partial h_0\approx0.48^T\to0$ regardless of where we start.</p>` },
          { pts: 1, q: R`ReLUs are good at preserving gradients in deep neural networks. Would it be wise to replace the sigmoid activation above with a ReLU activation unit? Explain your answer.`,
            a: R`<p>No. With $h_{t+1}=\mathrm{ReLU}(3h_t-1)$ the only fixed point $h=0.5$ is unstable: for $h_0\gt0.5$ the state grows without bound ($\approx3^t$) and the gradient $\partial h_T/\partial h_0=3^T$ <strong>explodes</strong>; for $h_0\lt0.5$ the state hits 0 and the gradient becomes exactly 0. ReLU helps feed-forward depth because each layer has its own weights, but in an RNN the same weight is multiplied at every step. Gated units (LSTM/GRU) are the better fix.</p>` },
        ] },
    ],
  };
})();
