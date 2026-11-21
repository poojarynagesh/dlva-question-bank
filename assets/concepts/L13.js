(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L13"] = [
    { h: R`Sequence tasks and the RNN idea`, t: "def", b: R`
<p>An RNN accepts and produces sequences of varying length. Four patterns:</p>
<table>
<tr><th>Pattern</th><th>Example</th></tr>
<tr><td>one-to-one</td><td>image classification</td></tr>
<tr><td>one-to-many</td><td>image captioning (image to words)</td></tr>
<tr><td>many-to-one</td><td>sentiment classification</td></tr>
<tr><td>many-to-many</td><td>machine translation (lengths may differ)</td></tr>
</table>
<p>The hidden state $h_t$ carries a summary of the past: $h_t=f(h_{t-1},x_t;\theta)$. Remove the recurrent path and you get an ordinary feed-forward net. Images can also be read as sequences (patches or pixels in an order, or video frames).</p>` },

    { h: R`Vanilla RNN equations, dimensions, weight sharing`, t: "exam", b: R`
<p>$$h_t=\tanh(W_{xh}x_t+W_{hh}h_{t-1}+b_h),\qquad o_t=W_{hy}h_t+b_y,\qquad \hat y_t=\operatorname{softmax}(o_t)$$</p>
<p>With $x_t\in\mathbb R^{d_x}$, $h_t\in\mathbb R^{d_h}$, $o_t\in\mathbb R^{d_y}$: $W_{xh}\in\mathbb R^{d_h\times d_x}$, $W_{hh}\in\mathbb R^{d_h\times d_h}$, $W_{hy}\in\mathbb R^{d_y\times d_h}$.</p>
<p><em>Parameter count.</em> $d_x=4,d_h=3,d_y=4$: $12+9+12$ weights $+\,3+4$ biases $=40$ parameters, regardless of whether the sequence has 5 or 5000 steps.</p>
<p><strong>Weight sharing over time</strong>: the same $W_{xh},W_{hh},W_{hy}$ are used at every step. This allows variable-length input, keeps the parameter count independent of length, and makes gradients from all time steps accumulate into the same matrices. $o_t$ are <strong>logits</strong> (pre-softmax), $\hat y_t$ the probabilities.</p>` },

    { h: R`Character-level language model, softmax and loss`, t: "exam", b: R`
<p>Vocabulary $\{h,e,l,o\}$ with one-hot inputs. To learn "hello", inputs h,e,l,l have targets e,l,l,o (the targets are the inputs shifted by one). Each step: $W_{xh}x_t+W_{hh}h_{t-1}+b$, $\tanh$, logits, softmax, compare with the true next character.</p>
<p>$$p_{t,j}=\frac{e^{o_{t,j}}}{\sum_k e^{o_{t,k}}},\qquad \mathcal L=-\sum_{t}\log p_{t,c_t}$$</p>
<p><em>Worked example.</em> Logits $[1,\,2.2,\,-3,\,4.1]$: exponentials $2.72,\,9.03,\,0.05,\,60.3$, sum $72.1$, probabilities $[0.038,\,0.125,\,0.001,\,0.837]$. If the correct class is the second one, $\mathcal L_t=-\ln0.125\approx2.08$; if it were the third, $-\ln0.001\approx6.9$. Reference values: $-\ln0.2=1.609$, $-\ln0.001=6.908$.</p>
<p>Logits can be negative and need not sum to 1; softmax exponentiates and normalises. A higher logit means stronger relative evidence. $h_t$ is a learned abstraction of everything seen up to $t$, not a copy of the input.</p>` },

    { h: R`Teacher forcing`, t: "def", b: R`
<p><strong>Training</strong>: at step $t+1$ feed the <em>ground-truth</em> token even if the model's prediction at step $t$ was wrong (the professor called it "input forcing"). Errors then do not corrupt all later training inputs, which stabilises learning.</p>
<p><strong>Generation</strong>: the truth is unavailable, so pick a token from the predicted distribution (argmax, sampling, or beam search) and feed it back as the next input. The model sees its own outputs only at inference time, so mistakes can compound.</p>` },

    { h: R`BPTT, vanishing and exploding gradients`, t: "exam", b: R`
<p>Backpropagation through time = backprop on the unrolled graph. A loss at time $T$ reaches an earlier state through a product of Jacobians:</p>
<p>$$\frac{\partial h_T}{\partial h_k}=\prod_{i=k+1}^{T}\frac{\partial h_i}{\partial h_{i-1}},\qquad \frac{\partial h_i}{\partial h_{i-1}}=\operatorname{diag}(1-h_i^2)\,W_{hh}$$</p>
<p>Relating events 100 steps apart multiplies about 100 such matrices. If factors are below 1: $0.8^{10}\approx0.107$, $0.8^{50}\approx1.4\times10^{-5}$, $0.8^{100}\approx2\times10^{-10}$, and even $0.9^{100}\approx2.7\times10^{-5}$: <strong>vanishing gradient</strong>. The $\tanh$ derivative lies in $(0,1]$ and is near 0 when saturated, which makes it worse. If factors exceed 1 in relevant directions: <strong>exploding gradient</strong> (unstable updates, overflow).</p>
<p>Controls: careful/orthogonal initialisation, <strong>gradient clipping</strong> (for exploding only), truncated BPTT, and gated cells (LSTM, GRU). Vanilla RNNs learn short dependencies fine; long ones fail.</p>` },

    { h: R`LSTM: cell state and three gates`, t: "exam", b: R`
<p>Long-range need: "I grew up in France ... I speak fluent ____". Local syntax says a language fits; only the distant word "France" says which. The LSTM adds a <strong>cell state</strong> $C_t$ (long-term memory highway) controlled by sigmoid gates:</p>
<p>$$\begin{aligned}f_t&=\sigma(W_f[h_{t-1};x_t]+b_f)&&\text{forget}\\ i_t&=\sigma(W_i[h_{t-1};x_t]+b_i)&&\text{input}\\ \tilde C_t&=\tanh(W_C[h_{t-1};x_t]+b_C)&&\text{candidate}\\ C_t&=f_t\odot C_{t-1}+i_t\odot\tilde C_t\\ o_t&=\sigma(W_o[h_{t-1};x_t]+b_o)&&\text{output}\\ h_t&=o_t\odot\tanh(C_t)\end{aligned}$$</p>
<p><em>Numeric step.</em> $C_{t-1}=[2,-1]$, $f_t=[0.9,0.1]$, $i_t=[0.5,1]$, $\tilde C_t=[0.4,-0.6]$ gives $C_t=[1.8+0.2,\;-0.1-0.6]=[2.0,\,-0.7]$.</p>
<p>Professor's analogies: a gate is a <strong>water tap</strong> (1 open, 0 closed, in between partial flow) or an <strong>audio equaliser</strong>; with a 512-d state there are 512 independent taps. Example: when a new grammatical subject appears, forget the old subject's gender (forget gate) and write the new one (input gate). $\sigma(0)=0.5$.</p>
<p><strong>Why gradients improve</strong>: $\partial C_t/\partial C_{t-1}\approx f_t$, so $\partial C_T/\partial C_k\approx\prod f_t$, which stays near 1 when $f_t\approx1$. The additive update acts like a residual / skip path, but it is not a pure identity because the forget gate can scale it.</p>` },

    { h: R`GRU and parameter counts`, b: R`
<p>$$\begin{aligned}z_t&=\sigma(W_zx_t+U_zh_{t-1}+b_z),\quad r_t=\sigma(W_rx_t+U_rh_{t-1}+b_r)\\ \tilde h_t&=\tanh(W_hx_t+U_h(r_t\odot h_{t-1})+b_h)\\ h_t&=(1-z_t)\odot h_{t-1}+z_t\odot\tilde h_t\end{aligned}$$</p>
<p>Update gate $z_t$ interpolates between old state and candidate; reset gate $r_t$ controls how much old state feeds the candidate. No separate cell state, 2 gates instead of 3, so fewer parameters and often faster training.</p>
<p><em>Count.</em> With $d_h=128$, $d_x=64$ each weight block has $128\cdot(128+64)+128=24{,}704$ parameters. Vanilla RNN: 1 block = 24,704; GRU: 3 blocks = 74,112; LSTM: 4 blocks = 98,816.</p>
<p>Which of LSTM and GRU is better depends on task and data.</p>` },

    { h: R`Interpretable cells and why transformers took over`, b: R`
<p>Trained only on next-character prediction, some units specialise: one fires after an opening quote until it closes, others track line ends or code comments. This is <strong>emergent representation</strong>. Caution: many cells have no clear meaning, and concepts are usually distributed across many dimensions.</p>
<p>The same simple objective on Shakespeare gives first word-like fragments, then words, grammar, then style; on LaTeX or Linux C source it gives plausible syntax (even compilable), yet content can be meaningless or wrong: surface plausibility is not correctness.</p>
<p><strong>Sequential bottleneck</strong>: $h_t$ depends on $h_{t-1}$, so time steps in one sequence cannot be computed in parallel. That limits GPU use on huge corpora; LSTMs still serve smaller or streaming problems. Transformers keep context via <strong>self-attention</strong> (every token weights every other token, e.g. in "The animal didn't cross the street because it was too tired", "it" attends strongly to "animal") with far more parallelism; in images the context is spatial, from all directions. Attention weights are learned, not co-occurrence counts, and real models still have a finite context window.</p>` },

    { h: R`Common mistakes`, t: "pitfall", b: R`
<ul>
<li>Calling $o_t$ probabilities: they are logits (negative values are fine); softmax comes after.</li>
<li>Saying each time step has its own weights: they are shared.</li>
<li>Gradient clipping fixes exploding gradients only; it does nothing for vanishing ones.</li>
<li>Confusing roles: $C_t$ is the internal memory, $h_t$ is the gated view $o_t\odot\tanh C_t$ passed on and output.</li>
<li>Forget gate value near 1 means <em>keep</em>, near 0 means <em>erase</em>.</li>
<li>Teacher forcing is a training procedure; at generation time the model consumes its own outputs.</li>
<li>LSTMs ease but do not remove the long-range problem, and they remain sequential (not parallelisable over time).</li>
</ul>` },
  ];
})();
