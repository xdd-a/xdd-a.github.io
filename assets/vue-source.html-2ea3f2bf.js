import{_ as a,p as t,q as p,s as n,R as e,t as o,Y as c,n as l}from"./framework-e1bed10d.js";const i={},u={href:"https://vue-js.com/learn-vue/",target:"_blank",rel:"noopener noreferrer"},k=c(`<h2 id="第一章、变化侦测篇" tabindex="-1"><a class="header-anchor" href="#第一章、变化侦测篇" aria-hidden="true">#</a> 第一章、变化侦测篇</h2><h3 id="object-的变化侦测" tabindex="-1"><a class="header-anchor" href="#object-的变化侦测" aria-hidden="true">#</a> Object 的变化侦测</h3><h4 id="使-object-数据变得-可观测" tabindex="-1"><a class="header-anchor" href="#使-object-数据变得-可观测" aria-hidden="true">#</a> 使 Object 数据变得 “可观测”</h4><ul><li>我们通过 Object.defineProperty() 方法为对象添加 getter 和 setter 方法 <ul><li>当访问对象的属性时，getter 会被调用</li><li>当修改对象的属性时，setter 会被调用</li></ul></li><li>在 vue 中，定义了 <code>Observer</code> 类，在构造函数中，为对象自身设置了 <code>__ob__</code> 属性，value 是 <code>Observer 实例</code></li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>
<span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value<span class="token punctuation">;</span>
        <span class="token comment">// 给 value 打上标记，表示已经转为响应式的了，避免重复操作。</span>
        <span class="token function">def</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&#39;__ob__&#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>

        <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>
            <span class="token comment">// 如果是对象，则将对象中的所有属性，转为可观测的。</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">obj</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> keys <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> keys<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">defineReactive</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> keys<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 使一个对象转化成可观测对象
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">obj</span> 要被转化成可观测对象的普通对象
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> <span class="token parameter">key</span> 对象的某个属性
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">val</span> 对象的某个属性的值
     */</span>
    <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span>key<span class="token punctuation">,</span>val</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">// 如果没传 val 则取 obj[key] 的值</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>arguments<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            val <span class="token operator">=</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 如果 val 是对象，则递归调用 Observer 构造函数</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> val <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">new</span> <span class="token class-name">Observer</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span>key<span class="token punctuation">,</span><span class="token punctuation">{</span>
            <span class="token comment">// 可枚举的。</span>
            <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
            <span class="token comment">// 可更改的。</span>
            <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
            <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;我被读取了&quot;</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span> val<span class="token punctuation">;</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token function">set</span><span class="token punctuation">(</span>newVal<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;我被赋值了&quot;</span><span class="token punctuation">)</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>val <span class="token operator">===</span> newVal<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
                val <span class="token operator">=</span> newVal<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>



</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="依赖收集" tabindex="-1"><a class="header-anchor" href="#依赖收集" aria-hidden="true">#</a> 依赖收集</h4><ul><li>将对象变得可观测之后，我们又如何通知视图去发生变更呢？ <ul><li>答案就是依赖收集，我们可以通过谁使用了该数据，就更新对应的视图。</li><li>在 <code>getter</code> 的时候收集依赖，在 <code>setter</code> 的时候通知依赖更新</li></ul></li><li>在 vue 中 是通过实现了一个 <code>Dep</code> 依赖管理类，在内部添加了一个 <code>depend</code> 方法来收集依赖，<code>notify</code> 方法来通知依赖更新 <ul><li>之后在 <code>getter</code> 中，调用 <code>dep.depend()</code> 收集依赖</li><li>在 <code>setter</code> 中，调用 <code>dep.notify()</code> 通知依赖进行更新</li></ul></li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>
<span class="token keyword">class</span> <span class="token class-name">Dep</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>subs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token function">addSub</span><span class="token punctuation">(</span><span class="token parameter">sub</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>sub<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token function">depend</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">addSub</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>


    <span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">const</span> sub <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>subs<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> subs<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            subs<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value<span class="token punctuation">;</span>
        <span class="token comment">// 给 value 打上标记，表示已经转为响应式的了，避免重复操作。</span>
        <span class="token function">def</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">&#39;__ob__&#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>

        <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>
            <span class="token comment">// 如果是对象，则将对象中的所有属性，转为可观测的。</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">obj</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> keys <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> keys<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">defineReactive</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> keys<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 使一个对象转化成可观测对象
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">obj</span> 要被转化成可观测对象的普通对象
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> <span class="token parameter">key</span> 对象的某个属性
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">val</span> 对象的某个属性的值
     */</span>
    <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span>key<span class="token punctuation">,</span>val</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">// 如果没传 val 则取 obj[key] 的值</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>arguments<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            val <span class="token operator">=</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 如果 val 是对象，则递归调用 Observer 构造函数</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> val <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">new</span> <span class="token class-name">Observer</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span>key<span class="token punctuation">,</span><span class="token punctuation">{</span>
            <span class="token comment">// 可枚举的。</span>
            <span class="token literal-property property">enumerable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
            <span class="token comment">// 可更改的。</span>
            <span class="token literal-property property">configurable</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
            <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;我被读取了&quot;</span><span class="token punctuation">)</span>
                新增 <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">dep.depend()</span><span class="token template-punctuation string">\`</span></span>
                <span class="token keyword">return</span> val<span class="token punctuation">;</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token function">set</span><span class="token punctuation">(</span>newVal<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;我被赋值了&quot;</span><span class="token punctuation">)</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>val <span class="token operator">===</span> newVal<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
                val <span class="token operator">=</span> newVal<span class="token punctuation">;</span>
                新增 <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">dep.notify()</span><span class="token template-punctuation string">\`</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>



</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="依赖到底是谁" tabindex="-1"><a class="header-anchor" href="#依赖到底是谁" aria-hidden="true">#</a> 依赖到底是谁？</h4><ul><li>我们完成了依赖收集，但是我们收集的依赖到底是谁呢？</li><li>在 vue 中，实现了 <code>Watcher</code> 类，这个类的实例，就是依赖的那个 <code>谁</code>，谁用到了数据，我们就为谁创建一个 <code>Watcher</code>类实例，之后数据变化的时候，我们只需要通知依赖的<code>Watcher 实例</code>，由他去更新视图</li><li>实例化 <code>Watcher</code>类的时候，会先执行他的构造函数，在构造函数中，调用了一个方法 <code>this.get()</code> 的实例方法，将实例自身赋值给了全局的唯一对象 <code>window.target</code>。通过 <code>this.getter.call(vm,vm)</code>获取被依赖的数据,获取到数据之后相当于调用依赖的getter，然后调用dep.depend 收集依赖，将windwo.target的值存入依赖数组,然后清空window.target</li><li>Watcher 将自身实例，设置到 <code>window.target</code> 中，然后读取数据，因为读了数据，所以会触发这个数据的 <code>getter</code>，紧接着 getter中会将window.target上的值加入依赖数组中，然后清空window.target</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Watcher</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">vm<span class="token punctuation">,</span>exOrFn<span class="token punctuation">,</span>cb</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>vm <span class="token operator">=</span> vm<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>exOrFn <span class="token operator">=</span> exOrFn<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>cb <span class="token operator">=</span> cb<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>getter <span class="token operator">=</span> <span class="token function">parsePath</span><span class="token punctuation">(</span>exOrFn<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span>
    <span class="token punctuation">}</span>

    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        window<span class="token punctuation">.</span>target <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
        <span class="token keyword">let</span> value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getter</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
        window<span class="token punctuation">.</span>target <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">const</span> bailRe <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[^\\w.$]</span><span class="token regex-delimiter">/</span></span>
    <span class="token function">parsePath</span><span class="token punctuation">(</span><span class="token parameter">exOrFn</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> exOrFn <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">return</span> exOrFn<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">if</span><span class="token punctuation">(</span>bailRe<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>exOrFn<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">const</span> segments <span class="token operator">=</span> exOrFn<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&#39;.&#39;</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">obj</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> segments<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>obj<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
                obj <span class="token operator">=</span> obj<span class="token punctuation">[</span>segments<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">return</span> obj<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>




</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11);function r(d,v){const s=l("ExternalLinkIcon");return t(),p("div",null,[n("p",null,[n("a",u,[e("参考文献"),o(s)])]),k])}const b=a(i,[["render",r],["__file","vue-source.html.vue"]]);export{b as default};
