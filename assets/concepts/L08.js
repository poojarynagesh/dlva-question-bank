(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L08"] = [
    { h: R`The CNN layer: mandatory core and optional extras`, t: "def", b: R`$$Y=f(W*X+b)$$
<p>with $X\in\mathbb{R}^{W_{in}\times H_{in}\times C_{in}}$, $F$ filters each $K\times K\times C_{in}$, a bias vector $b\in\mathbb{R}^F$ (<strong>one scalar per filter</strong>) and elementwise nonlinearity $f$ (ReLU).</p>
<ul><li><strong>Mandatory:</strong> convolution + activation. Without the activation, $W_2*(W_1*X)=(W_2*W_1)*X$ is a single linear operation.</li><li><strong>Optional:</strong> pooling (downsampling, invariance) and normalisation (LRN in AlexNet, later replaced by Batch Norm / Layer Norm).</li></ul>` },
    { h: R`Pooling: max, average, L2`, t: "def", b: R`<p>Pooling works on <strong>each channel independently</strong>, sliding a window with a stride; it has no learnable weights.</p>
<table><tr><th>Type</th><th>Formula</th><th>Effect</th></tr>
<tr><td>Max</td><td>$y=\max x_{m,n}$</td><td>keeps strongest activation, suppresses weak noise; used in over 90% of vision nets</td></tr>
<tr><td>Average</td><td>$y=\frac{1}{P_wP_h}\sum x_{m,n}$</td><td>smooths / blurs; global average pooling (GAP) before the classifier in modern nets</td></tr>
<tr><td>L2</td><td>$y=\sqrt{\sum x_{m,n}^2}$</td><td>energy of the window</td></tr></table>
<p>Example: the $2\times2$ block $\begin{bmatrix}1&3\\2&9\end{bmatrix}$ max-pools to 9 (average pooling gives 3.75).</p>` },
    { h: R`Why pool?`, b: R`<ol><li><strong>Tapering:</strong> $2\times2$ pooling with stride 2 halves width and height ($200\times200\to100\times100$), cutting the area by 75%. Later layers can then afford more channels.</li><li><strong>Noise robustness:</strong> non-maximal background values are discarded.</li><li><strong>Small-shift invariance:</strong> if a feature moves by 1-2 pixels, the local max often stays the same.</li><li><strong>Quantisation:</strong> exact pixel location becomes "feature present in this region".</li></ol>
<p>Pooling keeps the number of channels unchanged and has 0 parameters.</p>` },
    { h: R`LeNet-5 (1998) layer by layer`, t: "exam", b: R`<p>LeCun, Bell Labs, handwritten digits (MNIST, 10 classes). Input $32\times32\times1$.</p>
<table><tr><th>Layer</th><th>Output</th><th>Params</th></tr>
<tr><td>C1: 6 filters $5\times5\times1$</td><td>$28\times28\times6$ (4,704 neurons)</td><td>$6(25+1)=156$</td></tr>
<tr><td>S2: $2\times2$ avg pool, s=2</td><td>$14\times14\times6$</td><td>0 (modern view)</td></tr>
<tr><td>C3: 16 filters $5\times5\times6$</td><td>$10\times10\times16$</td><td>$16(150+1)=2{,}416$</td></tr>
<tr><td>S4: $2\times2$ pool</td><td>$5\times5\times16=400$</td><td>0</td></tr>
<tr><td>F5: 400 to 120</td><td>120</td><td>$48{,}120$</td></tr>
<tr><td>F6: 120 to 84</td><td>84</td><td>$10{,}164$</td></tr>
<tr><td>Output: 84 to 10</td><td>10</td><td>$850$</td></tr></table>
<p>Total about $61{,}706$ parameters (about 60K). Note how the FC layers already dominate: 59,134 of 61,706.</p>` },
    { h: R`"The right algorithm at the wrong time"`, t: "def", b: R`<p>LeNet-5 already had convolution, weight sharing, pooling, depth and backprop, yet CNNs took 14 years (1998 to 2012) to dominate. Reasons given in class:</p>
<ol><li><strong>No compute:</strong> single-core CPUs, no GPUs.</li><li><strong>No data:</strong> no digital-camera/internet era; MNIST (60,000 tiny images) was one of few datasets.</li><li><strong>Community skepticism:</strong> preference for hand-crafted features (SIFT, HOG) plus SVMs; neural nets seen as black boxes.</li></ol>` },
    { h: R`AlexNet (2012): what was new`, t: "def", b: R`<p>Krizhevsky, Sutskever, Hinton. Won ILSVRC 2012 and ignited deep learning in vision. Trained on 1.2 million images, 1000 classes.</p>
<ul><li><strong>GPUs:</strong> two GTX 580s with 3 GB each, so the network was split across them (96 Conv1 filters as 48 + 48), with cross-GPU communication only at some layers. This explains the two-stream diagram.</li><li><strong>ReLU</strong> instead of sigmoid/tanh: about 6x faster convergence.</li><li><strong>Overlapping pooling</strong> $3\times3$, stride 2.</li><li><strong>Dropout</strong> (50%) in the FC layers.</li><li>Local response normalisation (later obsolete).</li></ul>
<p>Top-5 error fell from about 26% to about 15-16% (the notes quote both 15.3% and 16.4%, so quote only "about 10 points lower" if unsure).</p>` },
    { h: R`AlexNet parameter table (a favourite exam computation)`, t: "exam", b: R`<p>Input $227\times227\times3$ (224 in the paper, 227 makes stride 4 exact): $(227-11)/4+1=55$.</p>
<table><tr><th>Layer</th><th>Output</th><th>Params</th></tr>
<tr><td>Conv1 96 of $11\times11\times3$, s=4</td><td>$55\times55\times96$</td><td>$96(363+1)=34{,}944$</td></tr>
<tr><td>MaxPool $3\times3$, s=2</td><td>$27\times27\times96$</td><td>0</td></tr>
<tr><td>Conv2 256 of $5\times5\times96$, p=2</td><td>$27\times27\times256$</td><td>$614{,}656$</td></tr>
<tr><td>MaxPool</td><td>$13\times13\times256$</td><td>0</td></tr>
<tr><td>Conv3 384 of $3\times3\times256$, p=1</td><td>$13\times13\times384$</td><td>$885{,}120$</td></tr>
<tr><td>Conv4 384 of $3\times3\times384$</td><td>$13\times13\times384$</td><td>$1{,}327{,}488$</td></tr>
<tr><td>Conv5 256 of $3\times3\times384$</td><td>$13\times13\times256$</td><td>$884{,}992$</td></tr>
<tr><td>MaxPool</td><td>$6\times6\times256=9216$</td><td>0</td></tr>
<tr><td>FC6 9216 to 4096</td><td>4096</td><td>$37{,}752{,}832$</td></tr>
<tr><td>FC7</td><td>4096</td><td>$16{,}781{,}312$</td></tr>
<tr><td>FC8</td><td>1000</td><td>$4{,}097{,}000$</td></tr></table>
<p>Total about 62 million parameters. <strong>Conv layers: few parameters, most neurons/FLOPs. FC layers: about 94% of parameters</strong> (FC6 alone about 60%).</p>` },
    { h: R`Why one bias per filter, and how GPUs run convolution`, b: R`<p><strong>Bias.</strong> A student asked why a $28\times28$ feature map has 1 bias, not 784. Because the filter and its bias are shared across positions:</p>
$$a(x,y,f)=\text{ReLU}\Big(\sum_{m,n,c}W_f(m,n,c)\,X(x+m,y+n,c)+b_f\Big)$$
<p>A separate bias per location would break translation invariance (the same object at two places would be shifted by different constants).</p>
<p><strong>GPU view.</strong> Patch computations are independent, so convolution is turned into one big matrix multiply: <code>im2col</code> flattens each receptive field into a row of $X_{col}$ (length $K^2C_{in}$), filters form $W_{col}$ of size $F\times K^2C_{in}$, and $W_{col}X_{col}^T$ (GEMM) gives all outputs at once.</p>` },
    { h: R`Common mistakes and a closed-set trap`, t: "pitfall", b: R`<ul><li>Counting <strong>bias per neuron</strong> in a conv layer; it is per filter.</li><li>Giving a filter depth 1 in C3 of LeNet; it is 6 (the input channels).</li><li>Saying pooling has learnable parameters (it has none in the modern view).</li><li>Saying pooling changes the number of channels; it only shrinks spatial size.</li><li>Believing the FC layers hold most of the <em>compute</em>; they hold most of the <em>parameters</em>, convs hold the compute.</li><li><strong>Closed-set assumption:</strong> a 5-class softmax network must put its probability on one of the 5 classes, so feeding a "motorbike" still gives a confident wrong class.</li></ul>` },
  ];
})();
