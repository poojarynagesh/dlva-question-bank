(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L06"] = [
    { h: R`What "deep" learning actually means`, t: "def", b: R`<p>Deep learning is a <strong>cascade of nonlinear transformations</strong> learned from data. "Deep" simply counts layers. The professor's own remark: <em>"There is nothing magic about the word deep. Even if you use one convolution layer, people call it a deep network."</em></p>
<p>Two ideas set it apart from the classical pipeline (hand-crafted SIFT/HOG features, then a classifier):</p>
<ul><li><strong>End-to-end learning:</strong> raw pixels in, labels out. Features are learned, not designed.</li><li><strong>Modality-agnostic:</strong> the same framework works for images, speech or text. All you need is input data and ground truth.</li></ul>
<p>Historical trigger: in 2012 Krizhevsky's AlexNet (a CNN trained on 2 GPUs) beat every classical approach on ImageNet, which started the deep-learning era in vision.</p>` },
    { h: R`Why nonlinearity creates depth`, t: "exam", b: R`<p>Student question: <em>"What if every layer is linear and only the last layer is nonlinear?"</em> Answer: all the linear layers still collapse into one matrix.</p>
$$W_3\,W_2\,W_1\,x = W_{\text{comb}}\,x,\qquad W_{\text{comb}}=W_3W_2W_1$$
<p>A product of matrices is a matrix, so without nonlinearity <strong>there is no concept of depth</strong>, however many layers you stack. The professor: <em>"Nonlinearity is what is separating these blocks. Then only you get the concept of depth."</em></p>
<p>Clarification from the Q&amp;A: nobody draws layer boundaries by hand. The activation between layers is what stops the chain from being simplified.</p>
<p><strong>Mini-example.</strong> $W_1\in\mathbb{R}^{100\times3072}$, $W_2\in\mathbb{R}^{50\times100}$, $W_3\in\mathbb{R}^{10\times50}$ with no activations is exactly one $10\times3072$ linear map (rank at most 50). It cannot solve XOR. Put a ReLU after $W_1$ and $W_2$ and the collapse is prevented.</p>` },
    { h: R`The neuron model and common activations`, t: "def", b: R`<p>A single neuron computes</p>
$$y=\sigma(w^\top x+b)$$
<p>with input $x$, weight vector $w$, bias $b$ and nonlinearity $\sigma$ (ReLU, sigmoid, tanh, ...).</p>
<table><tr><th>Activation</th><th>Formula</th><th>Remember</th></tr>
<tr><td>Sigmoid</td><td>$1/(1+e^{-z})$</td><td>output in $(0,1)$, $\sigma'\le 0.25$, saturates</td></tr>
<tr><td>tanh</td><td>$\tanh z$</td><td>zero-centred, $\tanh'\le1$, still saturates</td></tr>
<tr><td>ReLU</td><td>$\max(0,z)$</td><td>gradient 1 for $z\gt0$, 0 for $z\lt0$; cheap; can "die"</td></tr></table>` },
    { h: R`Fully connected layers on images: why they fail`, b: R`<p>A fully connected (FC) layer connects every input to every output.</p>
<ul><li>CIFAR-10 image $32\times32\times3$ flattens to 3072 numbers. Ten class scores need $10\times3072=30{,}720$ weights, which is fine.</li><li>A $224\times224\times3$ image has $150{,}528$ inputs, so even one modest hidden layer is huge.</li><li>FC treats a corner pixel exactly like a central pixel: it <strong>ignores spatial structure</strong>.</li></ul>
<p><strong>Key observation (translation):</strong> if we look for an edge or a cat's ear, we want to detect it wherever it appears. That motivates processing small patches with the same weights.</p>` },
    { h: R`Weight sharing: the central idea of a CNN`, t: "exam", b: R`<p>Cut the image into small patches (e.g. $5\times5$). Instead of learning a separate weight set per patch, force them all to be equal:</p>
$$W_1=W_2=\cdots=W_K=W,\qquad \text{Output}[i]=W\cdot\text{Patch}[i]+b\;\;\forall i$$
<p>Professor's argument: if a cat's ear at position (10,10) excites $W$, the same ear at (50,50) should excite the same $W$. So <em>"don't use 40,000 different weights; use the same weights for all the 40,000 patches, as simple as that."</em></p>
<p><strong>Count.</strong> Without sharing: about 40,000 patches $\times$ 75 weights each = 3 million. With sharing: one $5\times5\times3$ filter = <strong>75 weights</strong> (+1 bias), regardless of image size.</p>` },
    { h: R`Four properties of a CNN`, t: "def", b: R`<ol><li><strong>Weight sharing (tied weights):</strong> one filter applied at all positions.</li><li><strong>Local connectivity:</strong> each neuron sees only a small patch, not the whole image.</li><li><strong>Translation invariance</strong> (more precisely: the convolution is translation <em>equivariant</em>, shifting the input shifts the output; later pooling adds approximate invariance).</li><li><strong>Hierarchical features:</strong> deeper layers capture more abstract patterns.</li></ol>
<p><strong>Why several filters?</strong> One filter detects one kind of feature. Many filters give many detectors (edges, textures, patterns) and each produces one output channel.</p>` },
    { h: R`End-to-end training pipeline`, b: R`<ol><li>Feed the raw image (no hand-crafted features).</li><li>Pass through convolution + nonlinearity layers (feature extraction).</li><li>Compute the loss against ground truth.</li><li>Backpropagate gradients through all layers.</li><li>Update the shared weights by gradient descent.</li></ol>
<p>Recap from L05: machine learning means finding the right parameters; the loss measures the prediction-vs-truth gap; gradient descent moves against the gradient until a (local) minimum is reached. Because a weight is shared, its gradient is the <strong>sum</strong> of contributions from every position where it was used.</p>` },
    { h: R`Common mistakes`, t: "pitfall", b: R`<ul><li><strong>"Nonlinearity only at the end is enough."</strong> No: everything before it collapses into one linear map.</li><li><strong>"Weight sharing means fewer outputs."</strong> No: it keeps the number of outputs but slashes the number of <em>parameters</em>.</li><li><strong>Parameters depend on image size.</strong> They do not for a conv filter: $K\times K\times C_{in}$ weights whatever the image size.</li><li><strong>"CNNs are rotation/scale invariant."</strong> Weight sharing only buys translation behaviour.</li><li><strong>Depth means many layers of any kind.</strong> Depth only counts if nonlinearities separate them.</li></ul>` },
  ];
})();
