(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L15"] = [
    { h: R`From context to transformers`, b: R`
<p>Parts of data can be predicted from their surroundings: a missing word from neighbouring words, a hidden image patch from the other patches. Nearby patches give local clues, distant ones global context. Different elements should therefore contribute by <em>different amounts</em>: that is attention.</p>
<p>RNNs process tokens one by one, so they are hard to parallelise and long-range information must travel through many steps. The Transformer (<em>Attention Is All You Need</em>, 2017) removes recurrence: every token compares directly with every other. The original translation model has an <strong>encoder</strong> (contextual source representations) and a <strong>decoder</strong> (generates the target token by token).</p>` },

    { h: R`Tokens, embeddings and positional encoding`, t: "def", b: R`
<p>Text is split into tokens (words, subwords, punctuation, special markers). Subwords keep the vocabulary small and compose rare words. Each token ID indexes a learned vector, giving $X\in\mathbb R^{n\times d_{\text{model}}}$ (unlike one-hot, related tokens sit close together).</p>
<p>Self-attention alone is <strong>permutation-equivariant</strong>: shuffle the tokens and the outputs just shuffle. So add position: $H^{(0)}=X+P$, with sinusoidal encodings in the original model:</p>
<p>$$PE(pos,2i)=\sin\!\Big(\tfrac{pos}{10000^{2i/d_{\text{model}}}}\Big),\quad PE(pos,2i+1)=\cos\!\Big(\tfrac{pos}{10000^{2i/d_{\text{model}}}}\Big)$$</p>
<p>E.g. at $pos=0$ the encoding is $[0,1,0,1,\dots]$. Modern variants use learned, relative or rotary positions. The model must know both <em>what</em> a token is and <em>where</em> it is.</p>` },

    { h: R`Scaled dot-product self-attention`, t: "exam", b: R`
<p>Three learned projections of the same sequence: $Q=XW_Q$ (what each token looks for), $K=XW_K$ (what it offers for matching), $V=XW_V$ (what it contributes if selected). Think of a retrieval system: query matched against keys returns values.</p>
<p>$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\Big(\frac{QK^{\top}}{\sqrt{d_k}}\Big)V,\qquad h_i=\sum_j a_{ij}v_j$$</p>
<p><em>Shapes.</em> $n=10$, $d_k=64$: $Q:10\times64$, $K^\top:64\times10$, scores $10\times10$, times $V:10\times d_v$ gives $10\times d_v$.</p>
<p><em>Tiny softmax.</em> With $d_k=4$ and raw scores $[4,2,0]$: scaled by $\sqrt4=2$ gives $[2,1,0]$, exponentials $7.39,2.72,1$, weights $[0.665,0.245,0.090]$ (sum 1). The output is $0.665v_1+0.245v_2+0.090v_3$.</p>
<p><strong>Why $\sqrt{d_k}$</strong>: if entries of $q,k$ have unit variance, $q^\top k$ has variance $d_k$ (std 8 for $d_k=64$). Large logits saturate the softmax and give tiny gradients; dividing by $\sqrt{d_k}$ restores std 1.</p>
<p><strong>Cost</strong>: the $n\times n$ score matrix makes time and memory $O(n^2)$. "Self" because $Q,K,V$ come from one sequence; in cross-attention they come from different ones. "Bank" attends to "river" or "money" depending on context.</p>` },

    { h: R`Multi-head attention`, t: "exam", b: R`
<p>$$\operatorname{head}_i=\operatorname{Attention}(QW_i^Q,KW_i^K,VW_i^V),\qquad \operatorname{MHA}=\operatorname{Concat}(\operatorname{head}_1,\dots,\operatorname{head}_h)W^O$$</p>
<p>Each head works in its own projection space and can specialise (nearby syntax, long-distance links, subject-object); roles are learned, not assigned. With $d_{\text{model}}=512$, $h=8$: $d_k=d_v=64$ per head; concatenating 8 outputs of 64 restores 512, then $W^O$ mixes them.</p>
<p><em>Parameters.</em> $W_Q,W_K,W_V,W^O$ are each $512\times512$ in total (the per-head matrices are slices): $4\cdot512^2=1{,}048{,}576$ weights (without biases), the same as a single 512-d head.</p>` },

    { h: R`The encoder block`, t: "exam", b: R`
<ol>
<li>multi-head self-attention, then residual add and LayerNorm,</li>
<li>position-wise feed-forward network (FFN), then residual add and LayerNorm.</li>
</ol>
<p>$$H'=\operatorname{LN}(H+\operatorname{MHA}(H,H,H)),\qquad H_{\text{out}}=\operatorname{LN}(H'+\operatorname{FFN}(H')),\qquad \operatorname{FFN}(x)=\sigma(xW_1+b_1)W_2+b_2$$</p>
<ul>
<li><strong>Attention mixes information between positions; the FFN transforms each position independently</strong> (same MLP weights at every position; expand, ReLU/GELU, project back to $d_{\text{model}}$).</li>
<li><strong>Residual</strong>: each layer learns a correction; better gradient flow in deep stacks.</li>
<li><strong>LayerNorm</strong>: $\gamma\frac{x-\mu}{\sqrt{\sigma^2+\epsilon}}+\beta$ over the features of each token, not over the batch; fine for variable lengths and small batches.</li>
</ul>` },

    { h: R`Decoder, causal mask, cross-attention, generation`, t: "exam", b: R`
<p>For next-token prediction position $i$ must not see the future. Add a mask before softmax:</p>
<p>$$M_{ij}=\begin{cases}0&j\le i\\-\infty&j\gt i\end{cases},\qquad \operatorname{softmax}\!\Big(\frac{QK^\top}{\sqrt{d_k}}+M\Big)V$$</p>
<p>For 3 tokens the allowed pattern is lower-triangular: token 1 sees {1}, token 2 sees {1,2}, token 3 sees {1,2,3}; $-\infty$ becomes probability 0 after softmax.</p>
<p><strong>Training is parallel</strong> (all positions at once under the mask, with teacher forcing on the true previous tokens); <strong>generation is sequential</strong> (each new token depends on those already generated; stop at an end token or length limit). Output: $p(w_{t+1}\mid w_{\le t},c)=\operatorname{softmax}(W_oh_t+b_o)$.</p>
<p><strong>Cross-attention</strong> (translation): queries from the decoder, keys and values from the encoder output, linking each target token to relevant source tokens. In encoder self-attention every token sees every token; in the causal decoder only itself and earlier ones.</p>` },

    { h: R`Pretraining: BERT, GPT, scaling`, b: R`
<p>Self-supervised objectives give essentially unlimited labels from raw text:</p>
<table>
<tr><th></th><th>BERT</th><th>GPT</th></tr>
<tr><td>Block type</td><td>encoder, bidirectional</td><td>decoder, causal</td></tr>
<tr><td>Objective</td><td>masked language modelling (use left and right context)</td><td>causal LM (next token)</td></tr>
<tr><td>Strength</td><td>understanding, classification</td><td>open-ended generation</td></tr>
</table>
<p><strong>Fine-tuning</strong>: adapt with a comparatively small labelled set (add a classification head on a pooled representation, or train to emit task text), like transfer learning from pretrained CNN features. Scaling needs model size, training tokens, data quality and compute together. Large models show <strong>in-context (few-shot) learning</strong>: instructions and examples in the prompt steer behaviour with no gradient update.</p>` },

    { h: R`Vision Transformer (ViT) and CNN comparison`, t: "exam", b: R`
<p>Image $H\times W\times C$, patch size $P$: $N=HW/P^2$ patches. Each flattened patch is linearly projected by $E$; prepend a learnable [CLS] token and add position embeddings:</p>
<p>$$z_0=[x_{\text{class}};\,x_p^1E;\dots;x_p^NE]+E_{\text{pos}}$$</p>
<p><em>Example.</em> $224\times224$, $P=16$: $14\times14=196$ patches plus [CLS] = 197 tokens; each flattened patch has $16\cdot16\cdot3=768$ values; the attention matrix is $197^2=38{,}809$ per head. With $P=8$ you get $784$ patches and about 16 times more attention entries (quadratic cost). The final [CLS] state feeds the classifier.</p>
<ul>
<li>Every patch attends to every other from the first layer (global), but locality is <strong>not</strong> built in and must be learned.</li>
<li>CNNs: strong locality and weight-sharing bias, so data-efficient on small data. ViTs: weaker bias, can underperform with limited data, but scale better with very large datasets. This is a statement about scaling curves, not that CNNs cannot scale.</li>
<li>A patch plays the role of a word (one sequence element), but starts as a fixed block of many pixels.</li>
</ul>` },

    { h: R`Common mistakes`, t: "pitfall", b: R`
<ul>
<li>Forgetting positional information: without it self-attention cannot tell orderings apart (permutation-equivariant).</li>
<li>Dividing by $d_k$ instead of $\sqrt{d_k}$, or thinking the scaling is for speed (it prevents softmax saturation).</li>
<li>Saying softmax is taken over columns: it is row-wise, each row sums to 1.</li>
<li>Claiming generation is parallel: only training is (under the causal mask).</li>
<li>Mixing up LayerNorm (per token, no batch statistics) with BatchNorm.</li>
<li>Q, K, V are separate learned projections, not three different inputs (in self-attention they come from the same sequence).</li>
<li>Thinking the FFN mixes tokens: attention mixes tokens; the FFN acts on each position separately.</li>
<li>Equating multi-head with extra parameters: splitting 512 into 8 heads of 64 keeps parameter count the same.</li>
</ul>` },
  ];
})();
