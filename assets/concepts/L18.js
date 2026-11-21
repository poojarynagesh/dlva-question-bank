(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L18"] = [
    { h: R`The problem: novel view synthesis`, t: "def", b: R`<p>Given 2D images of a scene from several viewpoints, build a 3D representation that can be <strong>rendered from new viewpoints</strong>. Methods trade off four things: <strong>quality</strong>, <strong>training time</strong>, <strong>rendering speed (fps)</strong> and <strong>supervision required</strong> (camera poses? how many views?).</p>
<p>Two big families: <em>implicit</em> (scene stored in network weights, NeRF) and <em>explicit</em> (scene stored as primitives, 3DGS).</p>` },
    { h: R`NeRF recap: the prior state of the art`, b: R`<p>NeRF is an <strong>implicit</strong> MLP $F_\theta:(x,y,z,\theta,\phi)\mapsto(r,g,b,\sigma)$ from a 3D point and viewing direction to colour and density. Rendering = <strong>volume rendering</strong>: shoot a ray per pixel, sample points on it, query the MLP, alpha-composite colour weighted by density.</p>
<ul>
<li>~<strong>2 days</strong> to train per scene.</li>
<li>~<strong>10 fps</strong> rendering, too slow for real time.</li>
<li>Scene baked in weights: hard to edit or query quickly.</li>
</ul>` },
    { h: R`3D Gaussian Splatting: what is stored and how it renders`, t: "exam", b: R`<p>The scene is an <strong>explicit cloud of 3D Gaussians</strong>. Each stores:</p>
<table><tr><th>Parameter</th><th>Role</th></tr>
<tr><td>mean $\mu$</td><td>3D position</td></tr>
<tr><td>covariance $\Sigma$</td><td>size, shape, orientation (ellipsoid; often rotation + scale)</td></tr>
<tr><td>colour</td><td>view-dependent via <strong>spherical harmonics</strong></td></tr>
<tr><td>opacity $\alpha$</td><td>how solid</td></tr></table>
$$G(x)=\exp\!\bigl(-\tfrac12(x-\mu)^\top\Sigma^{-1}(x-\mu)\bigr).$$
<p><strong>Splatting:</strong> project each 3D Gaussian onto the image plane, <strong>depth-sort</strong> and <strong>alpha-composite</strong>. This is rasterisation (no ray-marching an MLP), hence very fast. It is differentiable: all Gaussian parameters are optimised with a <strong>photometric loss</strong> (rendered vs ground-truth image). <strong>Adaptive densification</strong> splits/clones Gaussians in under-reconstructed regions; near-transparent ones are <strong>pruned</strong>.</p>
<p>Because the scene is explicit, it is easier to edit, move and render than NeRF weights.</p>` },
    { h: R`Speed numbers to remember`, t: "exam", b: R`<table><tr><th></th><th>Train time</th><th>Render</th></tr>
<tr><td>NeRF</td><td>~2 days</td><td>~10 fps</td></tr>
<tr><td>3DGS</td><td>~5-30 min</td><td>~500-700 fps</td></tr></table>
<p><strong>Quick ratios:</strong> 2 days $=2880$ min vs 30 min: at least $\sim96\times$ faster training (up to $\sim575\times$ at 5 min). Rendering: $500/10=50\times$ to $700/10=70\times$. A real-time budget of 60 fps is $\approx16.7$ ms per frame; NeRF's 10 fps is 100 ms per frame.</p>` },
    { h: R`Initialisation, dynamic scenes, surfaces`, b: R`<ul>
<li><strong>SfM / COLMAP</strong> runs first: it estimates <strong>camera poses</strong> and a <strong>sparse point cloud</strong>; each point initialises a Gaussian's mean. SfM is slow and can fail on textureless or few-view scenes. This dependency is what pose-free methods try to remove.</li>
<li><strong>Dynamic / 4D scenes:</strong> give each Gaussian a velocity or time-dependent position/deformation (4D = 3D + time).</li>
<li><strong>Surface extraction:</strong> a Gaussian cloud is volumetric, not a mesh, so getting clean geometry (for simulation, collision, printing) is a separate problem.</li>
<li><strong>Storage:</strong> a scene can be large; compression (pruning, quantising SH, complexity-adaptive allocation) is an active area.</li>
</ul>` },
    { h: R`From per-scene optimisation to feed-forward and foundation models`, t: "def", b: R`<p><strong>Per-scene (classic 3DGS):</strong> images of one scene, COLMAP init, optimise 5-30 min, render. <strong>Feed-forward:</strong> a trained network <em>predicts</em> the 3D representation in a <strong>single forward pass</strong> for any scene. A <strong>foundation model</strong> here is a large pretrained model that generalises across scenes (sometimes without poses).</p>
<table><tr><th>Model</th><th>Key point</th></tr>
<tr><td>PixelSplat</td><td>Gaussians from as few as 2 views, feed-forward</td></tr>
<tr><td>NoPoSplat, Razor</td><td>pose-free reconstruction</td></tr>
<tr><td>AdaptiveSplat</td><td>more Gaussians where scene <em>complexity</em> (wavelet measure) is high</td></tr>
<tr><td>SensitiveSplat</td><td>capacity where rendering output is most <em>sensitive</em></td></tr>
<tr><td>AnySplat</td><td>flexible across input conditions</td></tr>
<tr><td>4DGT</td><td>dynamic, time-aware transformer</td></tr>
<tr><td>DUSt3R / MASt3R</td><td>dense geometry from image pairs without explicit calibration; MASt3R adds matching</td></tr>
<tr><td>VGGT (and "Omega")</td><td>any number of images; global attention across frames + frame-wise attention</td></tr>
<tr><td>LVSM</td><td>latent scene tokens, <em>no explicit 3D</em></td></tr></table>
<p>Complexity vs sensitivity: complexity looks at scene detail/texture; sensitivity looks at where output error matters most. Both decide <em>where to spend capacity</em>.</p>` },
    { h: R`Generative 3D and video as supervision`, b: R`<p>3D ground truth is <strong>scarce and expensive</strong>; 2D images and video are <strong>abundant</strong>. So:</p>
<ul>
<li><strong>CAT3D / CAT4D</strong> use 2D/video generative models to supervise 3D/4D reconstruction.</li>
<li><strong>DreamGaussian:</strong> text/image to 3D using Gaussians and generative priors.</li>
<li><strong>Trellis:</strong> two flow models, first <em>structure</em>, then <em>colour/appearance</em>.</li>
<li><strong>Stable Virtual Camera:</strong> consistent novel views as if moving a virtual camera.</li>
</ul>
<p>(Names such as Razor, Lyra, SceneTalk, X-Factor were transcribed phonetically in the notes; focus on the ideas.)</p>` },
    { h: R`Big picture: trends and the Bitter Lesson`, t: "exam", b: R`<ul>
<li><strong>Opposing trends:</strong> 3D reconstruction goes toward explicit, bigger, faster-rendering representations; LLMs go toward compression into dense weights/latents. (LVSM is a bridge: latent, no explicit 3D.)</li>
<li><strong>Tesla</strong> dropped explicit 3D reconstruction in its autonomy stack, favouring learned end-to-end vision. <strong>Oculus/VR:</strong> rendering is cheap, generating video is expensive, so cheap real-time rendering is attractive.</li>
<li><strong>Bitter Lesson (Sutton):</strong> general methods that leverage computation (learning and search) beat hand-designed inductive biases given enough compute and data. In 3D: hand-built pipelines (SfM, geometric priors, pose estimation) get replaced by big learned feed-forward models. Echoes LLaVA (L17): simple "images as tokens + big LLM" beat intricate fusion.</li>
<li>Benchmarking is fragmented (datasets, metrics, number of views, pose-free or not), so centralised benchmarks are needed.</li>
</ul>` },
    { h: R`Common slips`, t: "pitfall", b: R`<ul>
<li>NeRF is <em>implicit</em> (MLP + volume rendering); 3DGS is <em>explicit</em> (Gaussians + rasterisation). Do not swap them.</li>
<li>3DGS is <strong>not</strong> pose-free: it relies on COLMAP poses and a sparse point cloud. NoPoSplat/Razor are the pose-free ones.</li>
<li>Feed-forward models do <strong>no per-scene optimisation</strong> at test time; PixelSplat needs only 2 views, VGGT any number.</li>
<li>Covariance $\Sigma$ encodes shape/orientation/size, opacity is separate, colour is view-dependent through spherical harmonics.</li>
<li>"Omega" in VGGT-Omega is just a naming for an extended/scaled version, not a technical term.</li>
</ul>` },
  ];
})();
