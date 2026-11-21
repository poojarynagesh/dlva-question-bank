(function () {
  const R = String.raw;
  (window.QB_CONCEPTS = window.QB_CONCEPTS || {})["L12"] = [
    { h: R`The problem: novel-view synthesis and inverse graphics`, t: "def", b: R`
<p><strong>Novel-view synthesis</strong>: given multi-view images of a scene, learn a 3D representation that renders an image from a camera pose that was never photographed. Uses: XR/AR/VR, simulation, relighting, robotics.</p>
<p>Forward graphics: $\text{3D scene}+\text{camera pose}\to\text{2D image}$. <strong>Inverse graphics</strong> reverses it: $\text{2D images}\to\text{3D scene}+\text{camera poses}$ (and optionally albedo, BRDF, lighting). It is <strong>ill-posed</strong>: many scenes explain the same photos (occlusion, ambiguous depth, lighting). This lecture focuses on scene geometry plus poses.</p>
<p>Pipeline: multi-view images, estimate poses, 3D representation, <em>differentiable renderer</em>, rendered view, compare with real photo, backprop the image loss into the representation.</p>` },

    { h: R`Camera pose and structure from motion (SfM)`, t: "exam", b: R`
<p>A <strong>pose</strong> = translation $(t_x,t_y,t_z)$ + rotation (e.g. $3\times3$ matrix); viewing direction comes from the rotation, not from foreground/background. <strong>Extrinsics</strong> = rotation and translation relative to the world; <strong>intrinsics</strong> = internal projection properties (camera coordinates to pixels).</p>
<p><strong>SfM (e.g. COLMAP)</strong>: detect features, match across images, form tracks of the same 3D point, jointly optimise poses and points by minimising reprojection error (bundle adjustment):</p>
<p>$$L_{\text{reproj}}=\sum_{i,j}\left\lVert u_{ij}-\pi(R_iX_j+t_i)\right\rVert^2$$</p>
<p>$X_j$ = 3D point, $(R_i,t_i)$ = camera $i$, $u_{ij}$ = observed pixel, $\pi$ = projection. Output: poses plus a <strong>sparse</strong> point cloud, too sparse for a reliable mesh. <strong>3DGS</strong> uses both poses and sparse points (to initialise Gaussians); <strong>NeRF</strong> typically needs only the poses.</p>` },

    { h: R`Differentiable rendering`, t: "def", b: R`
<p>Loop: initialise scene parameters $\theta$; render $R(\theta,p)$ from a known pose $p$; compare with the real photo; backpropagate through the renderer; update.</p>
<p>$$L(\theta)=\mathcal D\big(R(\theta,p),I_{\text{gt}}\big),\qquad \theta\leftarrow\theta-\eta\nabla_\theta L$$</p>
<p>"Differentiable" describes the renderer (gradients can flow through it), not a particular representation: mesh, NeRF, point cloud or Gaussians all work. The renderer can be ray-based or rasterisation-based. NeRF uses ray-based volume rendering; 3DGS uses differentiable rasterisation.</p>` },

    { h: R`NeRF: implicit scene in an MLP`, t: "exam", b: R`
<p>A NeRF is an MLP of five inputs: $F_\theta(x,y,z,\theta_v,\phi_v)\to(\mathbf c,\sigma)$. Position (3) + two viewing-direction angles (2); output colour (view-dependent) and density $\sigma$.</p>
<p>For each pixel shoot a ray, sample points along it, and composite:</p>
<p>$$\hat C(r)=\sum_{i=1}^{N}T_i\,\alpha_i\,\mathbf c_i,\qquad T_i=\prod_{j\lt i}(1-\alpha_j)$$</p>
<p>$T_i$ = transmittance (light surviving the earlier samples). <em>Mini-example.</em> Three samples with $\alpha=0.5,0.5,0.8$: weights $T_i\alpha_i=0.5,\;0.25,\;0.2$; leftover transmittance $0.5\cdot0.5\cdot0.2=0.05$ (background). An opaque near sample ($\alpha\approx1$) hides everything behind it.</p>
<p>Weights are compressed into the network, so each scene needs its own training. Drawback: speed, because every ray sample needs an MLP query.</p>` },

    { h: R`3D Gaussians: parameters and covariance`, t: "def", b: R`
<p>3DGS replaces the MLP with an <strong>explicit</strong> set of millions of learnable Gaussians. Each has:</p>
<ol>
<li>mean $\mu\in\mathbb R^3$ (location),</li>
<li>covariance $\Sigma\in\mathbb R^{3\times3}$ (size, orientation, anisotropic shape: an ellipsoid),</li>
<li>opacity $\alpha$,</li>
<li>colour as spherical-harmonic coefficients (view-dependent appearance).</li>
</ol>
<p>$\Sigma$ must be positive semidefinite, so it is parameterised as</p>
<p>$$\Sigma=R\,S\,S^{\top}R^{\top}$$</p>
<p>with rotation $R$ and diagonal scale $S$, optimised separately. <em>Example</em>: $R=I$, $S=\operatorname{diag}(2,1,0.5)$ gives $\Sigma=\operatorname{diag}(4,1,0.25)$, an ellipsoid elongated along $x$. Equal scales give an isotropic sphere (initial setup); optimisation makes it anisotropic.</p>
<p>Why a Gaussian and not a point: it has spatial extent and shape. Covariance is about shape, not depth. Depth comes from position and is used for ordering. Multiple Gaussians per pixel are not colour channels: each has its own RGB and they are alpha-blended.</p>` },

    { h: R`Splatting and alpha blending`, t: "exam", b: R`
<p><strong>Splatting</strong> = projecting a 3D primitive to screen space; a 3D Gaussian becomes a 2D Gaussian (ellipse). Perspective projection is not affine, so the projection is linearised at the Gaussian centre with a Jacobian (EWA splatting):</p>
<p>$$\Sigma_{2D}\approx J\,W\,\Sigma\,W^{\top}J^{\top}$$</p>
<p>$W$ = world-to-camera transform, $J$ = Jacobian of the local projection; $\Sigma_{2D}$ is $2\times2$. Then depth-sort and blend front to back with the same compositing as NeRF:</p>
<p>$$C=\sum_iT_i\alpha_ic_i,\qquad T_i=\prod_{j\lt i}(1-\alpha_j)$$</p>
<p>Sorting is essential because the blend is order dependent. A Gaussian has infinite support, but tiny contributions are culled in practice.</p>` },

    { h: R`Training, adaptive density control and the tile rasteriser`, t: "exam", b: R`
<p>No MLP: each Gaussian's parameters are updated directly by gradients, <strong>per scene</strong>. Loss: $L=(1-\lambda)L_1+\lambda L_{\text{D-SSIM}}$; runs of about 7k or 30k iterations.</p>
<p><strong>Adaptive density control</strong> (heuristic, roughly every 100 iterations) fixes under- and over-reconstruction:</p>
<ul>
<li>large positional gradient + <strong>small</strong> Gaussian: <strong>clone</strong> (and displace);</li>
<li>large positional gradient + <strong>large</strong> Gaussian: <strong>split</strong>;</li>
<li>very low opacity: <strong>prune</strong>;</li>
<li>periodic <strong>opacity reset</strong> (about every 3000 iterations) so early opacity decisions do not block gradients.</li>
</ul>
<p><strong>Tile-based rasteriser</strong> (why it is fast): split the image into $16\times16$ tiles (a $1920\times1080$ image has $120\times68=8160$ tiles); cull Gaussians that barely overlap; duplicate a Gaussian once per tile it touches, each copy with a 64-bit key = tile ID (high 32 bits) | depth (low 32 bits); radix-sort all keys; each tile blends its own depth-ordered list in parallel on the GPU.</p>` },

    { h: R`NeRF vs 3DGS, limitations, workflow`, b: R`
<table>
<tr><th></th><th>NeRF</th><th>3DGS</th></tr>
<tr><td>Representation</td><td>implicit, MLP weights</td><td>explicit Gaussians</td></tr>
<tr><td>Rendering</td><td>ray marching, many MLP queries</td><td>rasterisation, sort, blend</td></tr>
<tr><td>Speed (lecture figures)</td><td>Mip-NeRF 360: about 48 h, 0.07 FPS</td><td>about 6 min short run, about 135 FPS</td></tr>
<tr><td>Memory</td><td>compact</td><td>large (millions of primitives)</td></tr>
<tr><td>Uses SfM points?</td><td>no (poses only)</td><td>yes, for initialisation</td></tr>
</table>
<p><strong>Limitations of vanilla 3DGS</strong>: memory (later compression methods), aliasing at different scales (Mip-Splatting), weak geometry so mesh extraction is hard (SuGaR, Gaussian opacity fields), heuristic densification (better initialisation, MCMC), and no inherent motion or lighting (dynamic/relightable variants). Transformer predictors (VGGT-like) can reduce per-scene optimisation.</p>
<p><strong>Practical workflow</strong>: walk around an object with a phone, extract frames, run COLMAP (or VGGT) for poses and sparse points, initialise Gaussians, train with GSplat, inspect in a viewer. Needs a capable GPU (about 45 GB was mentioned).</p>` },

    { h: R`Common traps`, t: "pitfall", b: R`
<ul>
<li>"Differentiable rendering means rendering a point cloud": wrong, it is any renderer that passes gradients.</li>
<li>Covariance does not encode depth; mean and sorting do.</li>
<li>The 3D covariance is $RSS^\top R^\top$, not $RS R^\top$ and not an arbitrary matrix (it must stay PSD).</li>
<li>SfM output is sparse: it cannot give a mesh directly; 3DGS only <em>initialises</em> from it.</li>
<li>Vanilla 3DGS is optimised per scene; a new scene means new optimisation.</li>
<li>3DGS is faster than NeRF because it avoids MLP queries per ray sample, not because it has fewer parameters (it uses more memory).</li>
</ul>` },
  ];
})();
