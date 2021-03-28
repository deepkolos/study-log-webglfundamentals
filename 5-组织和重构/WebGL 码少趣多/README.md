# WebGL 码少趣多

主要是对 WebGL API 封装，方便使用

一些状态的关联可以程序化，前提是得熟悉 WebGL 的工作过程

原来可以拿到 program Uniform Attribute 的列表，拿到各个 Uniform Attribute 的定义

好处是，设置 Uniform 和 Attribute 不需要指定类型，类型使用 shader 里面写好的，当然是部分不是全部

其实回顾下 StateDiagram 就可以知道了，一些操作是可以归类，配置化的

属于工程问题，但是前提是得熟悉 webgl 运作流程
