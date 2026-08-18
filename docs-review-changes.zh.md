# 中文文档审阅与重写记录

## 1. 范围

本次处理 `content/docs` 下全部中文文档，共 290 个 `.zh.mdx` 文件。

实际产生差异的文件为 256 个，其余文件原本已符合句末规则，因此无需改动。

以下文件保持原样：

- `content/project/index.zh.mdx`（首页文档）
- `README.md`

## 2. 总体结果

- 移除句尾句号 3801 处
- 保留句子中间的句号 2414 处
- 修正中英文混排空格
- 统一视觉小说开发术语
- 保持代码块、行内代码、链接和组件标签不被误改
- 通过 `git diff --check` 校验

## 3. 句末处理

只移除行尾、段落末尾和表格单元格末尾的 `。`，句子中间的句号全部保留，不做换行改写。

代码块中的台词字符串、注释和示例代码保持原样，未改动其中的句号。

## 4. 术语对照

| 修改前 | 修改后 |
| --- | --- |
| 画外音 | 旁白 |
| Player 组件 | 播放器组件 |
| Game UI | 游戏界面 |
| Dialog 组件 | 对话框组件 |
| NVL Dialog | NVL 对话框 |
| 自定义 Dialog | 自定义对话框 |

保留了 `Player`、`Dialog`、`NVL` 等 API 标识符在代码中的原始写法。

## 5. 重点文风重写

在批量规范化的基础上，对明显带有直译感的句子做了人工改写。

### NarraLeaf-React 核心页

- “你可以用它的抽象类来创作故事” 改为 “你可以用它的抽象类来编写剧本”
- “动作能做一些事情，比如显示台词、播放声音或更换背景” 改为 “动作负责执行显示台词、播放声音、更换背景等操作”
- “NarraLeaf-React 只能理解动作” 改为 “NarraLeaf-React 只会执行这些动作”
- “一个基础的故事” 改为 “一个简单的故事”

### NarraLeaf-React 介绍页

- “可以用它直接用 React 构建自己的视觉小说” 改为 “可以直接用 React 构建自己的视觉小说”
- “取代了需要专用脚本语言的传统引擎，方案更灵活” 改为 “相比需要专用脚本语言的传统引擎，NarraLeaf-React 的集成方式更灵活”
- “如果你来自其他视觉小说引擎，我们准备了一些迁移指南，请查看迁移部分” 改为 “如果你之前使用其他视觉小说引擎，可查看迁移指南”

## 6. 分模块统计

| 模块 | 改动文件数 |
| --- | --- |
| narraleaf-react | 161 |
| studio | 74 |
| narraleaf | 21 |
| 合计 | 256 |

进一步细分：

- `narraleaf-react/core`：106 个
- `studio/blueprint`：30 个
- `studio/plugin`：25 个
- `narraleaf-react/player`：25 个
- `narraleaf/library`：21 个
- `narraleaf-react/solutions`：13 个
- `narraleaf-react/basic`：12 个
- `studio/workspace`：6 个
- `studio/model-runtimes`：4 个
- `studio/getting-started`：4 个
- `narraleaf-react/info`：2 个
- 其他入口与说明页：8 个

## 7. 校验结果

- 行尾、段落末尾和表格单元格末尾的剩余句号：0
- 保留的句中句号：2414 处
- 文档中残留的 `<br />`：0
- 汉字之间残留半角标点：0
- `git diff --check`：通过
- 首页文档与 `README.md`：无改动

完整改动清单可通过以下命令查看：

```bash
git diff --name-only -- content/docs
```
