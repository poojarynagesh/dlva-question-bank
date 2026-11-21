(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L09"] = [
    { h: R`Looking inside a CNN: Deconvnet and the feature hierarchy`, t: "def", b: R`<p>Zeiler and Fergus (2014) projected feature-map activations back to pixel space with a <strong>Deconvnet</strong>.</p>
<ul><li>Max pooling throws away <em>where</em> in the window the max was. During the forward pass, <strong>switches</strong> record that position.</li><li><strong>Unpooling</strong> puts the value back at the switch position and fills the other cells with zeros; then ReLU and a transposed convolution continue the projection.</li></ul>
<p>What the top-activating patches showed: Layer 1 oriented edges and colours (Gabor-like); Layer 2 corners, curves, textures; Layer 3 parts such as wheels, feathers, meshes; Layers 4-5 object-level concepts (dog faces, bird eyes, whole objects, in varied pose). So <strong>edges, then textures, then parts, then objects</strong>.</p>
<p>Why shallow layers have few filters (6, 16, 64) and deep ones many (256, 512): early layers only need simple edge/colour primitives; deep layers must represent many different compositions.</p>` },
    { h: R`Feature tapping and transfer learning`, b: R`<p>Deep embeddings are generic descriptors. Recipe:</p>
<ol><li>Take a network pre-trained on ImageNet (AlexNet, VGG-16).</li><li>Run the new-domain images (X-rays, sketches, satellite photos) through it.</li><li>Tap the 4096-d vector from FC6 or FC7 (before the softmax layer).</li><li>Train a simple linear classifier (linear SVM, logistic regression) on those vectors.</li></ol>
<p>The surprise from class: it works well even on domains very unlike ImageNet, with no retraining of the convolutional backbone.</p>` },
    { h: R`ILSVRC timeline`, t: "exam", b: R`<table><tr><th>Year</th><th>Model</th><th>Depth</th><th>Top-5 error</th><th>Key idea</th></tr>
<tr><td>pre-2012</td><td>SIFT + SVM</td><td>shallow</td><td>about 26%</td><td>hand-crafted features</td></tr>
<tr><td>2012</td><td>AlexNet</td><td>8</td><td>about 16%</td><td>GPU, ReLU, dropout</td></tr>
<tr><td>2014</td><td>VGG (runner-up)</td><td>16-19</td><td>7.3%</td><td>stacks of $3\times3$</td></tr>
<tr><td>2014</td><td>GoogLeNet (winner)</td><td>22</td><td>6.7%</td><td>Inception, $1\times1$, GAP</td></tr>
<tr><td>2015</td><td>ResNet</td><td>152</td><td>3.57%</td><td>residual connections</td></tr></table>
<p>Karpathy's human benchmark: about 5.1% top-5 error (hard cases include 200+ dog breeds). ResNet was the first to beat it.</p>` },
    { h: R`VGG: small filters, stacked`, t: "exam", b: R`<p>Two stacked $3\times3$ convs (stride 1) see a $5\times5$ region ($3+(3-1)=5$); three see $7\times7$.</p>
<table><tr><th></th><th>one $5\times5$</th><th>two $3\times3$</th></tr>
<tr><td>Weights (C in, C out)</td><td>$25C^2$</td><td>$18C^2$ (28% fewer)</td></tr>
<tr><td>ReLUs</td><td>1</td><td>2 (more nonlinear)</td></tr></table>
<p>VGG-16: 13 conv + 3 FC layers, all convs $3\times3$, s=1, p=1 (size preserved); only five $2\times2$ max-pools shrink the map: $224\to112\to56\to28\to14\to7$, ending at $7\times7\times512=25{,}088$.</p>
<p>About 138M parameters, of which FC6 ($25{,}088\times4096\approx102.7$M) is about 74%; the 13 convs total only about 15M. <strong>Memory (activations) is dominated by early convs; parameters by the first FC layer.</strong></p>` },
    { h: R`GoogLeNet: Inception module and 1x1 bottleneck`, t: "def", b: R`<p>Instead of choosing a filter size, run branches in parallel ($1\times1$; $1\times1\to3\times3$; $1\times1\to5\times5$; $3\times3$ pool $\to1\times1$) and <strong>concatenate along channels</strong>.</p>
<p>A $1\times1$ convolution mixes channels at each pixel (cross-channel linear combination plus ReLU). Used before the expensive convolutions it shrinks the depth.</p>
<p><strong>Worked FLOPs.</strong> Input $28\times28\times256$, a $5\times5$ conv with 32 filters (same padding):</p>
$$\text{direct}=28\cdot28\cdot32\cdot(5\cdot5\cdot256)=160{,}563{,}200$$
$$\text{bottleneck }(256\to16\to32)=28\cdot28\cdot16\cdot256+28\cdot28\cdot32\cdot(5\cdot5\cdot16)=3{,}211{,}264+10{,}035{,}200=13{,}246{,}464$$
<p>About a 12x reduction.</p>` },
    { h: R`GoogLeNet: auxiliary classifiers and global average pooling`, t: "exam", b: R`<p><strong>Auxiliary classifiers.</strong> Two extra softmax heads attached to intermediate blocks inject gradient into early layers during training:</p>
$$\mathcal{L}=\mathcal{L}_{final}+0.3\,\mathcal{L}_{aux1}+0.3\,\mathcal{L}_{aux2}$$
<p>They are <strong>discarded at test time</strong>.</p>
<p><strong>GAP instead of big FC layers.</strong> Final volume $7\times7\times1024$; averaging each channel over its 49 pixels gives a 1024-vector, then one $1024\times1000$ linear layer. This cut the model from VGG's 138M to about 5M parameters (about 28x smaller) with better accuracy. GAP itself has no parameters.</p>` },
    { h: R`ResNet: the degradation problem and the residual fix`, t: "exam", b: R`<p><strong>Degradation:</strong> a plain 56-layer net had <em>higher training error</em> than a plain 20-layer net. Since training error rose, this is <strong>not overfitting</strong>; it is an optimisation failure.</p>
<p><strong>Residual learning:</strong> let the layers fit $F(x)=H(x)-x$, so the block outputs</p>
$$H(x)=F(x)+x,\qquad \frac{\partial H}{\partial x}=\frac{\partial F}{\partial x}+1$$
<p>The $+1$ is a gradient highway: even if $\partial F/\partial x\to0$, gradient reaches earlier layers. Class analogy: if the main roads of central Bangalore are jammed, build an express bypass.</p>
<p><strong>Shape condition:</strong> $x$ and $F(x)$ must have the same size and channels; otherwise use a $1\times1$ projection on the shortcut.</p>
<p><strong>Bottleneck block</strong> (ResNet-50/101/152): $1\times1$ (256 to 64), $3\times3$ (64), $1\times1$ (64 to 256), added to the identity. ResNet-152: 3.57% top-5 error, and skip connections are now in Transformers and diffusion models too.</p>` },
    { h: R`Common mistakes`, t: "pitfall", b: R`<ul><li>Calling the ResNet degradation problem overfitting. Training error rises, so it is optimisation.</li><li>Forgetting that auxiliary heads are dropped at inference.</li><li>Saying the Inception branches are <em>added</em>; they are <strong>concatenated</strong> along channels (ResNet <em>adds</em>).</li><li>Assuming $1\times1$ convs do nothing. They mix channels and cut channel depth.</li><li>Putting VGG's parameters in the convs; 74% sit in FC6.</li><li>Believing a residual block's output is just $F(x)$; it is $F(x)+x$ (then ReLU).</li><li>Thinking Deconvnet needs no stored information; it needs the pooling switches.</li></ul>` },
  ];
})();
