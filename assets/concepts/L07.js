(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L07"] = [
    { h: R`PyTorch in one page: tensors, GPU, autograd`, t: "def", b: R`<p>PyTorch looks like NumPy but adds (1) <strong>GPU acceleration</strong> via CUDA and (2) <strong>autograd</strong>, automatic differentiation on a dynamically built graph.</p>
<ul><li>Tensors live on a device: <code>cpu</code> by default, <code>cuda:0</code> after <code>.to("cuda")</code> or <code>.cuda()</code>.</li><li>Attributes: <code>shape</code>, <code>dtype</code> (default <code>float32</code>), <code>device</code>.</li><li>Batched matmul: $(12\times4096\times768)\cdot(12\times768\times4096)\to12\times4096\times4096$. The leading 12 is a batch of 12 independent matmuls.</li><li>GPUs win (about 20-30x over CPU in class) because matmul is a pile of independent dot products and a GPU has thousands of small ALUs.</li></ul>` },
    { h: R`Autograd: leaf nodes, intermediates, backward()`, t: "def", b: R`<p>Operations on tensors with <code>requires_grad=True</code> build a DAG during the forward pass. <code>loss.backward()</code> walks it in reverse applying the chain rule.</p>
<ul><li><strong>Leaf node</strong>: a user-created tensor (parameter or input). Shown as <code>AccumulateGrad</code> in TorchViz. Its gradient is stored in <code>.grad</code>.</li><li><strong>Intermediate node</strong>: result of an operation. Its gradient is used for the chain rule but <strong>not retained</strong>, so <code>.grad</code> is <code>None</code> (saves GPU memory).</li><li>Nodes named like <code>MmBackward0</code> record which derivative function to call on the way back.</li><li>Gradients accumulate, so they must be zeroed after each update.</li></ul>` },
    { h: R`Worked backprop example (done in class)`, t: "exam", b: R`<p>Take $A=3$, $B=2A$, $C=B^2$, $D=C-2$, $E=D+2$.</p>
<p>Forward: $B=6,\;C=36,\;D=34,\;E=36$.</p>
$$\frac{\partial E}{\partial A}=\underbrace{1}_{\partial E/\partial D}\cdot\underbrace{1}_{\partial D/\partial C}\cdot\underbrace{2B}_{=12}\cdot\underbrace{2}_{\partial B/\partial A}=24$$
<p>Check: $E=4A^2\Rightarrow dE/dA=8A=24$. The only node with a non-trivial local derivative is the square; adding or subtracting constants contributes 1.</p>
<p>In PyTorch <code>a.grad</code> is 24 but <code>b.grad</code> is <code>None</code>.</p>` },
    { h: R`Training-loop counting: batch, epoch, iteration`, t: "exam", b: R`<p>The class toy task: a 2-layer MLP learns $y=x_1-x_2$ (a <strong>regression</strong>, so MSE loss), $H_1=\text{ReLU}(XW_1+b_1)$, $\hat y=H_1W_2+b_2$.</p>
$$\text{batches/epoch}=\frac{N}{B},\qquad \text{iterations}=\text{epochs}\times\frac{N}{B}$$
<p>With $N=1000$, $B=10$, 100 epochs: 100 batches per epoch and $100\times100=\mathbf{10{,}000}$ weight updates.</p>
<p>Loop order each iteration: forward, loss, <code>backward()</code>, update ($W\leftarrow W-\eta\,\nabla W$ under <code>no_grad</code>), zero the grads. Shuffle every epoch.</p>
<p>Parameter count of that MLP with $H=16$: $2\cdot16+16+16\cdot1+1=65$.</p>` },
    { h: R`Why CNNs: parameter explosion`, b: R`<p>A $200\times200\times3=120{,}000$-value image feeding a hidden layer of $10{,}000$ neurons needs $1.2\times10^9$ weights: overfitting, memory blow-up, hopeless training.</p>
<p>CNNs fix it with two spatial ideas:</p><ol><li><strong>Local receptive fields:</strong> each neuron sees a small patch ($3\times3$, $5\times5$, $7\times7$).</li><li><strong>Weight sharing:</strong> one filter is swept over the whole image.</li></ol>` },
    { h: R`Output-size formula, stride and padding`, t: "exam", b: R`$$W_{out}=\left\lfloor\frac{W_{in}-K+2P}{S}\right\rfloor+1$$
<ul><li>Padding $P$ adds $P$ rows/columns on <em>each</em> side, so the size grows by $2P$ (the lecture's reminder: $P=2$ gives $+4$).</li><li>To preserve size with stride 1: $P=\lfloor (K-1)/2\rfloor$, i.e. $K=3\to P=1$, $K=5\to P=2$, $K=7\to P=3$.</li><li>No padding loses $K-1$ pixels: $32\to28$ for a $5\times5$ filter.</li></ul>
<p>Pitfall: the floor matters when $(W_{in}-K+2P)$ is not divisible by $S$.</p>` },
    { h: R`Parameters vs neurons in a conv layer`, t: "exam", b: R`<p>Input $W_{in}\times H_{in}\times C_{in}$, $F$ filters of size $K\times K$ (each has depth $C_{in}$):</p>
$$\text{Params}=F\,(K\,K\,C_{in}+1),\qquad \text{Neurons}=W_{out}\,H_{out}\,F$$
<table><tr><th></th><th>Case 1 (P=0)</th><th>Case 2 (P=2)</th></tr>
<tr><td>Input</td><td>$32\times32\times3$</td><td>$32\times32\times3$</td></tr>
<tr><td>10 filters, $5\times5$, $S=1$</td><td colspan="2">same filters</td></tr>
<tr><td>Output</td><td>$28\times28\times10$</td><td>$32\times32\times10$</td></tr>
<tr><td>Params</td><td colspan="2">$10\times(75+1)=760$ (both!)</td></tr>
<tr><td>Neurons</td><td>$7{,}840$</td><td>$10{,}240$</td></tr></table>
<p>Padding changes neurons, never parameters. Conv layers: few parameters, many neurons. FC layers: the opposite.</p>` },
    { h: R`ReLU after every convolution`, t: "def", b: R`<p>Convolution is linear, so two stacked convolutions are one convolution. An activation after every conv is needed. The class choice is ReLU, $f(x)=\max(0,x)$:</p>
<ul><li>removes negatives (rectification);</li><li>gradient is exactly 1 for $x\gt0$, so it does not saturate like sigmoid/tanh;</li><li>trivially cheap (a threshold).</li></ul>` },
    { h: R`Common mistakes`, t: "pitfall", b: R`<ul><li>Confusing <strong>neurons</strong> with <strong>parameters</strong>. 10,240 neurons does <em>not</em> mean 10,240 parameters.</li><li>Forgetting the <strong>+1 bias</strong> per filter, or counting a bias per output pixel.</li><li>Using filter depth 1 instead of $C_{in}$ for an RGB or deeper input.</li><li>Adding only $P$ (not $2P$) when computing the padded size.</li><li>Expecting <code>.grad</code> on an intermediate tensor.</li><li>Forgetting to zero gradients: they accumulate.</li><li>Total iterations is $\text{epochs}\times N/B$, not $N/B$.</li></ul>` },
  ];
})();
