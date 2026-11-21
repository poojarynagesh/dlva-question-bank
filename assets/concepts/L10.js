(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L10"] = [
    { h: R`Saliency map: which pixels matter?`, t: "def", b: R`<p>For a trained CNN with <strong>frozen weights</strong>, let $S_k(I)$ be the unnormalised class score (logit) of class $k$. The saliency map is</p>
$$M_{x,y}=\left|\frac{\partial S_k(I)}{\partial I_{x,y}}\right|,\qquad M_{x,y}=\max_{c\in\{R,G,B\}}\left|\frac{\partial S_k}{\partial I_{x,y,c}}\right|\ \text{(RGB)}$$
<p>Analogy: in training, $\partial\mathcal{L}/\partial W$ says how to change weights; here $\partial S_k/\partial I$ says which pixels, if nudged, change the class score most. It costs one backward pass and needs weight access (<strong>white-box</strong>).</p>` },
    { h: R`White-box vs black-box explanation`, t: "exam", b: R`<table><tr><th></th><th>White-box (saliency)</th><th>Black-box (occlusion)</th></tr>
<tr><td>Access</td><td>weights and autograd graph</td><td>only input to output</td></tr>
<tr><td>Method</td><td>gradient $\partial S_k/\partial I$</td><td>perturb the input</td></tr>
<tr><td>Cost</td><td>one backward pass</td><td>one forward pass per mask position</td></tr>
<tr><td>Use</td><td>debugging your own model</td><td>auditing a proprietary API</td></tr></table>` },
    { h: R`Occlusion sensitivity`, b: R`<p>Slide a grey/black patch (e.g. $7\times7$ or $11\times11$) over the image with stride $S_{occ}$, run the network, and record the confidence drop:</p>
$$\text{Heat}(x,y)=P(k\mid I)-P(k\mid I_{\text{masked at }(x,y)})$$
<p><strong>Example.</strong> Dog image, $P=0.98$. Masking grass leaves 0.98 (heat 0). Masking the dog's face gives 0.02 (heat 0.96). The face is the evidence.</p>
<p>Number of forward passes is about (number of mask positions), e.g. a $224\times224$ image with an $11\times11$ patch at stride 11 takes about $20\times20=400$ passes.</p>` },
    { h: R`Spurious correlations and weak supervision`, t: "exam", b: R`<p>A model can score well by exploiting accidental co-occurrence. Professor's examples:</p>
<ul><li><strong>Hand and fish:</strong> ImageNet "tench" photos nearly always show an angler's hands. Saliency revealed the net looked at fingers; a hand holding a phone was called "fish".</li><li><strong>Boats and water:</strong> saliency also lights up the surrounding water, which is contextual evidence.</li></ul>
<p>Explainability is therefore an audit tool for such shortcuts.</p>
<p><strong>Weakly supervised object detection:</strong> train with image-level labels only, compute $M$ for the class, threshold at $\tau$ ($M\gt\tau$) and box the connected region. No bounding-box annotations are needed.</p>` },
    { h: R`RNN: why a CNN is not enough for sequences`, t: "def", b: R`<p>CNNs and MLPs treat samples as independent (i.i.d.). Speech, text, video and sketch strokes depend on order: $P(X_t\mid X_{t-1},\dots,X_1)$. "Dog bites man" and "Man bites dog" have identical bags of words.</p>
<p>An RNN keeps a <strong>hidden state</strong> $h_t$, a memory summarising inputs $1..t$, which is updated at every step. Unrolled in time it looks like a deep feed-forward net with one layer per time step.</p>` },
    { h: R`The RNN equations and weight sharing`, t: "exam", b: R`$$h_t=\tanh(W_{hh}h_{t-1}+W_{xh}X_t+b_h),\qquad \hat y_t=\text{softmax}(W_{hy}h_t+b_y),\quad h_0=0$$
<p>Shapes: $X_t\in\mathbb{R}^D$, $h_t\in\mathbb{R}^H$, $W_{xh}\in\mathbb{R}^{H\times D}$, $W_{hh}\in\mathbb{R}^{H\times H}$, $W_{hy}\in\mathbb{R}^{K\times H}$.</p>
<p><strong>The same $W_{xh},W_{hh},W_{hy},b_h,b_y$ are used at every time step.</strong> So the parameter count does not depend on the sequence length $T$, and the model handles any $T$.</p>
<p><strong>Count.</strong> $D=3$, $H=4$, $K=2$: $4\cdot3+4\cdot4+4+2\cdot4+2=42$ parameters, whether $T=5$ or $T=500$.</p>` },
    { h: R`Sketch recognition: reading the state over time`, b: R`<p>The professor's Pictionary / QuickDraw example. A person draws stroke by stroke ($X_1,X_2,\dots$) and the RNN updates its guess after each stroke:</p>
<ol><li>$t=1$, one curve: "flying bird", low confidence.</li><li>$t=3$, an oval body added: "horse" or "cow".</li><li>$t=6$, mane and snout: "lion", confidence about 0.95.</li></ol>
<p>The hidden state carries what was drawn so far, so predictions improve as evidence accumulates.</p>` },
    { h: R`Sequence taxonomy`, t: "exam", b: R`<table><tr><th>Type</th><th>Input to output</th><th>Examples</th></tr>
<tr><td>One-to-one</td><td>fixed to fixed</td><td>image classification, plain MLP</td></tr>
<tr><td>One-to-many</td><td>1 input to sequence</td><td>image captioning (CNN features, then words until <code>&lt;EOS&gt;</code>)</td></tr>
<tr><td>Many-to-one</td><td>sequence to 1 output</td><td>sentiment analysis, action recognition from 30 frames</td></tr>
<tr><td>Many-to-many</td><td>sequence to sequence ($T_x\ne T_y$ allowed)</td><td>machine translation; frame-wise video labelling</td></tr></table>
<p>Quick test: ask "how many inputs, how many outputs?". A movie review to one label is many-to-one; a photo to a sentence is one-to-many.</p>` },
    { h: R`Common mistakes`, t: "pitfall", b: R`<ul><li>Saliency uses the gradient w.r.t. the <strong>input pixels</strong>, not the weights, and the <strong>logit</strong> $S_k$ for a chosen class.</li><li>Occlusion needs no gradients or weights; it is slower, not more precise.</li><li>A good heatmap does not prove the model is right: it can point at a shortcut such as the hand in the fish photo.</li><li>Believing RNN weights differ per time step. They are shared; the hidden state differs.</li><li>Mixing up captioning (one-to-many) and sentiment (many-to-one).</li><li>Forgetting $h_0=0$ and that $W_{hh}$ is $H\times H$.</li></ul>` },
  ];
})();
