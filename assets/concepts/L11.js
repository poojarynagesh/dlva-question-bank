(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L11"] = [
    { h: R`Why self-supervised learning?`, b: R`
<p>In supervised learning every example needs a human label $Y$. Labels cost money, need experts (medical, industrial data), and are often noisy. Models now have billions of parameters, but expert labels do not scale with them, while raw images, video and text are abundant.</p>
<p><strong>Self-supervised learning (SSL)</strong> builds the training signal out of the data itself. The professor also gave a cognitive motivation: a baby is not told the name of every object at every moment; most of its learning is self-discovered plus some reinforcement from interaction.</p>
<p>Earlier SSL ideas existed in the ImageNet era, but compute was too limited to exploit them. Better compute and architectures made SSL pretraining practical.</p>` },

    { h: R`Pretext tasks, targets and the encoder`, t: "def", b: R`
<p>SSL does <em>not</em> mean "no objective". It means a <strong>pretext (proxy) task</strong> whose target is generated automatically by the training pipeline, not annotated by a human. The pretext task is not the task you care about; it only shapes an <strong>encoder</strong> whose features are then used on a <strong>downstream task</strong>. The decoder or pretext head is usually thrown away.</p>
<table>
<tr><th>Transformation applied</th><th>Automatic target</th></tr>
<tr><td>Add noise to image</td><td>the clean image</td></tr>
<tr><td>Mask a patch</td><td>the removed patch</td></tr>
<tr><td>Shuffle patches</td><td>the permutation used</td></tr>
<tr><td>Rotate by a known angle</td><td>the angle (0, 90, 180, 270)</td></tr>
<tr><td>Convert to grayscale</td><td>the original colour image</td></tr>
<tr><td>Two augmentations of one image</td><td>"these two are a positive pair"</td></tr>
</table>
<p>A pipeline is only as self-supervised as its parts: if a depth channel comes from a separately trained depth model that used human labels, supervised information has entered the pipeline.</p>` },

    { h: R`Evaluating a representation: linear probe vs fine-tuning`, t: "exam", b: R`
<p><strong>Linear probe</strong>: (1) pretrain the encoder with SSL, (2) <em>freeze</em> it, (3) attach a linear head, (4) train only the head on a labelled downstream set, (5) report accuracy.</p>
<p>$$\hat y=\operatorname{softmax}(Wh+b),\qquad h=\text{frozen features}$$</p>
<p>Downstream <em>images</em> go through the frozen encoder; the resulting features go to the new head together with the downstream labels. High probe accuracy means the classes are already (almost) linearly separable in $h$.</p>
<p><em>Mini-example.</em> A frozen encoder gives $h\in\mathbb R^{2048}$ and the task has 10 classes: the probe has $10\times2048+10=20{,}490$ trainable parameters, while the encoder contributes none.</p>
<ul>
<li><strong>Linear probe</strong>: fair comparison of two SSL methods (later updates cannot hide differences in the original representation).</li>
<li><strong>Fine-tuning</strong>: update some or all encoder weights; use it to deploy for a task, especially when pretext and downstream tasks are not aligned.</li>
</ul>
<p>Labels enter only <em>after</em> pretraining, so the pipeline is still called self-supervised. Evaluation must match intended use: good ImageNet accuracy does not imply good robotic action prediction.</p>` },

    { h: R`Reconstruction pretext tasks: denoising and context encoders`, b: R`
<p><strong>Denoising autoencoder.</strong> Corrupt $x$ to $\tilde x\sim q(\tilde x\mid x)$, encode $h=f_\theta(\tilde x)$, decode $\hat x=g_\phi(h)$, and minimise $\lVert x-\hat x\rVert_2^2$. The <strong>bottleneck</strong> is essential: without it the network can learn a near-identity copy that reconstructs well but yields no abstract features. Example: a noisy handwritten "2" must be cleaned; the code $h$ must keep digit identity, background colour and stroke colour.</p>
<p><strong>Context encoder (inpainting).</strong> Mask a region, encode the visible context, decode the hole. With binary mask $M$ (1 = missing):</p>
<p>$$x_{\text{visible}}=(1-M)\odot x,\qquad L_{\text{masked}}=\lVert M\odot(x-\hat x)\rVert_2^2$$</p>
<p>The network may output the whole image and the loss is applied only inside the mask, which supports random or user-drawn masks. A $128\times128$ image with a $64\times64$ hole hides $4096/16384=25\%$ of the pixels.</p>
<p>Loss trade-off: pixel MSE averages over plausible answers, giving <strong>blurry</strong> output; an adversarial loss alone gives a <strong>realistic but wrong</strong> patch; so use $L=L_{\text{rec}}+\lambda L_{\text{adv}}$. The discriminator learns fast, so update frequencies must be balanced or it saturates and gives no gradient. LPIPS-style perceptual loss compares deep-network activations and is a different thing from adversarial loss.</p>` },

    { h: R`Spatial and colour pretext tasks`, b: R`
<ul>
<li><strong>Relative position</strong>: a shared CNN encodes two patches and a classifier predicts their relative placement (e.g. 8 neighbours in a $3\times3$ grid). To place a cat's ear relative to its face the model must learn object structure.</li>
<li><strong>Jigsaw</strong>: shuffle 9 patches by a known permutation; shared-weight encoders feed a classifier over permutations. $9!=362{,}880$ is huge, so practical systems use a restricted subset of permutations. Forces global structure, not only local texture.</li>
<li><strong>Rotation</strong>: classify which of $\{0^\circ,90^\circ,180^\circ,270^\circ\}$ was applied. The model must know how objects normally stand (edges, shape, orientation); even four buckets give reasonable features.</li>
<li><strong>Split-brain / cross-channel</strong>: predict one half or channel of the image from the other (to extrapolate half a person you learn torso/arm/leg relations).</li>
<li><strong>Colorization</strong>: grayscale in, original colour out, MSE against the original. The colour image is the original data sample, not a human semantic label, hence still self-supervised.</li>
</ul>
<p>Each task embeds a hypothesis: denoising assumes structure survives corruption; inpainting that context predicts content; jigsaw that layout captures objects; rotation that canonical orientation matters; colorization that semantics predict colour.</p>` },

    { h: R`Contrastive learning and SimCLR`, t: "exam", b: R`
<p>Make two augmented views of each image. Views of the <em>same</em> image are a <strong>positive pair</strong> (attract); views of <em>different</em> images are <strong>negatives</strong> (repel). Augmentations: random crop, colour jitter, grayscale, blur, flip, cutout, noise, solarize.</p>
<p>$$L=-\log\frac{\exp(\operatorname{sim}(z,z^+)/\tau)}{\exp(\operatorname{sim}(z,z^+)/\tau)+\sum_{k}\exp(\operatorname{sim}(z,z_k^-)/\tau)}$$</p>
<p>This is a softmax / cross-entropy over candidates in which the positive is the "correct class". $\operatorname{sim}$ is cosine similarity, $\tau$ the temperature.</p>
<p><em>Counting.</em> A batch of $N=3$ images gives $2N=6$ views. For one anchor: 1 positive and $2N-2=4$ negatives, so 5 terms in the softmax.</p>
<p><em>Numbers.</em> Positive similarity 0.9, two negatives at 0.1, $\tau=1$: $e^{0.9}=2.46$, $e^{0.1}=1.105$ each, $p_+=2.46/(2.46+2.21)=0.527$, $L=-\ln0.527\approx0.64$. With $\tau=0.1$ the logits are $9,1,1$, $p_+\approx0.9993$, $L\approx0.0007$: a small temperature sharpens the softmax.</p>
<ul>
<li><strong>Strong augmentations</strong>: weak ones let the model cheat with colour. A grayscale crop and a colour crop should still map to the same dog.</li>
<li><strong>Large batches</strong> (thousands, e.g. 2048+): many diverse negatives; with few, a "negative" may be the same breed (false negative).</li>
<li><strong>Projection head</strong>: loss is applied on $z=g(h)$, but $h$ is transferred; $z$ absorbs the loss-specific bias.</li>
<li>False positives (crop contains a different object) and false negatives slow convergence but are averaged out at scale.</li>
</ul>` },

    { h: R`Collapse, shortcuts and inductive bias`, t: "pitfall", b: R`
<p><strong>Representation collapse</strong>: the encoder maps (nearly) every input to the same vector. Two augmentations of one image then have perfect similarity, the loss looks great, and the features are useless (a linear probe would be at chance). <em>Attraction alone permits collapse.</em> Remedies: negatives (repulsion), asymmetry with predictor heads and stop-gradient, teacher-student schemes, or regularisers.</p>
<p><strong>Shortcut</strong>: the network solves the pretext task with a spurious low-level cue (e.g. a cue correlated with rotation) and learns little about objects, so transfer is poor.</p>
<p><strong>Inductive bias</strong>: a preference built into architecture, transformation or loss. There is <strong>no universal SSL objective</strong>: edge detection needs shape, colour tasks need colour statistics, robotic manipulation needs shape, depth, geometry and time. So evaluate on several downstream tasks, not just the pretext score.</p>
<p>Common mistakes: calling a ViT "self-supervised" (ViT is an architecture; SSL is a training paradigm); thinking adversarial loss equals LPIPS; thinking SSL learns the word "bird" (it learns features, and a downstream classifier supplies the label).</p>` },

    { h: R`Non-contrastive methods, ViTs, VLMs and VLAs`, b: R`
<p><strong>Non-contrastive methods</strong> (DINO-style) use no explicit negatives and prevent collapse by other mechanisms. DINO is itself an SSL method. <strong>JEPA</strong> (Joint Embedding Predictive Architecture) predicts in embedding space; these were signposted as further reading, not derived.</p>
<p><strong>ViT</strong> has weaker built-in inductive bias than a CNN, so it is data hungry and benefits most from SSL on huge unlabeled sets.</p>
<p><strong>VLM</strong>: either train a vision encoder and a language model separately and connect them (projection layer plus multimodal data), or train natively multimodal from the start on image-caption pairs (image encoder, language model predicts the caption, gradients train both). Captions contain human-authored text, so this is not pure SSL on unlabeled images.</p>
<p><strong>VLA</strong>: pretrain a VLM, then fine-tune on a smaller curated dataset of (observation, action) pairs. Actions may be high-level commands or dense continuous controls (joint angles, velocity, acceleration), i.e. regression vectors rather than short text.</p>` },
  ];
})();
