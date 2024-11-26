export default {
	async fetch(request, env) {
	  // 获取请求的 URL
	  const url = new URL(request.url);
	  const key = url.searchParams.get('key');
	  const prompt = url.searchParams.get('prompt');  
	  const num_steps = url.searchParams.get('steps') || 8; 
  
	  // 打印日志以帮助调试
	  console.log('Requested URL:', url.toString());
	  console.log('Received key:', key);
	  
	  if (key !== env.KEYHOLDER) {
		// 如果没有 key 或 key 不匹配，返回 403 错误
		return new Response('Forbidden', { status: 403 });
	  }
  
	  // 如果是 GET 请求并且请求的路径是 API 路由
	  if (request.method === 'GET' && url.pathname === '/api/generate') {
		if (!prompt) {
		  return new Response('Prompt parameter is required', { status: 400 });
		}
  
		const generation_setting = {
		  prompt: prompt,
		  num_steps: num_steps,
		}
  
		try {
		  // 调用 AI.run 接口生成图像
		  const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', generation_setting);
		  console.log('flux loaded');
  
		  // 将返回的图像二进制数据转换为 Uint8Array
		  const binaryString = atob(response.image);
		  const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0));
  
		  // 返回生成的图像
		  return new Response(img, {
			headers: { 'content-type': 'image/png' },
		  });
		} catch (err) {
		  console.error('Error generating image:', err);
		  return new Response('Failed to generate image', { status: 500 });
		}
	  }
  
	  // 如果是 GET 请求，返回输入表单页面
	  if (request.method === 'GET') {
		return new Response(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>FLUX Generate</title>
		  <style>
			html, body {
				height: 100%; /* 使页面高度充满整个视口 */
				margin: 0;
				padding: 0;
			}

			body {
			  font-family: 'Arial', sans-serif;
			  background-color: #000000;
			  margin: 0;
			  padding: 0;
			  display: flex;
			  flex-direction: column;
			  justify-content: space-between;;
			  align-items: center;
			  position: relative;
			  color: aliceblue;
			  background-size: cover;
			  background-position: center;
			  transition: background 0.5s ease;
			  backdrop-filter: brightness(0.5) blur(12px);
			  -webkit-backdrop-filter: brightness(0.5) blur(12px);
			}

		
			.container {
			  margin-top: 25px;
			  background-color: #0000008c;
			  padding: 30px 40px;
			  border-radius: 15px;
			  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
			  text-align: center;
			  max-width: 600px;
			  max-height: 1059px;
			  width: 100%;
			  z-index: 1;
			  transition: transform 0.3s ease-in-out;
			  flex: 1;
			}
		
			.container:hover {
			  transform: scale(1.02);
			}
		
			h1 {
			  color: #4CAF50;
			  font-size: 28px;
			  margin-bottom: 20px;
			  font-weight: 600;
			}
		
			label {
			  font-size: 18px;
			  color: aliceblue;
			  margin-bottom: 10px;
			  display: block;
			  font-weight: 500;
			}
		
			textarea {
			  width: 100%;
			  height: 150px;
			  padding: 15px;
			  font-size: 16px;
			  border: 2px solid #ddd;
			  border-radius: 10px;
			  box-sizing: border-box;
			  background-color: #fafafa;
			  resize: vertical;
			  white-space: pre-wrap;
			  word-wrap: break-word;
			  transition: border-color 0.3s ease, box-shadow 0.3s ease;
			}
		
			input[type="range"] {
			  width: 100%;
			  margin: 20px 0;
			  height: 8px;
			}
		
			span#num_steps_value {
			  display: block;
			  font-size: 18px;
			  font-weight: 500;
			  color: aliceblue;
			}
		
			button {
			  background: linear-gradient(135deg, #4CAF50, #45a049);
			  color: white;
			  border: none;
			  padding: 12px 25px;
			  font-size: 18px;
			  border-radius: 8px;
			  cursor: pointer;
			  transition: background 0.3s, transform 0.2s ease;
			  margin-top: 20px;
			  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
			}
			
			button.loading {
			  pointer-events: none; /* 禁用按钮 */
			  animation: pulsate 1s infinite; /* 应用明暗交替动画 */
			}
  
			/* 明暗交替的动画效果 */
			@keyframes pulsate {
			  0% {
				background-color: #4CAF50;
				box-shadow: 0 0 8px rgba(0, 255, 0, 0.7); /* 初始状态的阴影 */
			  }
			  50% {
				background-color: #45a049; /* 背景颜色变暗 */
				box-shadow: 0 0 16px rgba(0, 255, 0, 1); /* 阴影变亮 */
			  }
			  100% {
				background-color: #4CAF50; /* 恢复背景颜色 */
				box-shadow: 0 0 8px rgba(0, 255, 0, 0.7); /* 恢复阴影 */
			  }
			}
			
  
			button:hover {
			  background: linear-gradient(135deg, #45a049, #4CAF50);
			  transform: translateY(-2px);
			}
		
			button:active {
			  transform: translateY(1px);
			}
		
			.form-container {
			  margin-top: 20px;
			}

			footer {
			  display: flex;
			  color: #888;
			  margin-top: 30px;
			  font-size: 14px;
			  width: 100%;
			  text-align: center;
			  z-index: 1;
			  flex-wrap: nowrap;
			  flex-direction: column;
			  align-items: center;
			  justify-content: center;
		  	}
		
			footer p {
			  margin: 5px 0;
			}
		
			@media (max-width: 600px) {
			  .container {
				padding: 20px;
			  }
		
			  h1 {
				font-size: 24px;
			  }
		
			  label,
			  button {
				font-size: 16px;
			  }
		
			  textarea {
				height: 120px;
			  }
		
			  input[type="range"] {
				height: 6px;
			  }
			}
		
			.generated-image {
			  margin-top: 20px;
			  max-width: 100%;
			  height: auto;
			  border-radius: 8px;
			}
		  </style>
		</head>
		<body>
		  <div class="container">
			<h1>flux-1-schnell 图像生成</h1>
			<form id="generate-form" action="#" method="POST" class="form-container">
			  <label for="prompt">输入提示词 Prompt:</label>
			  <textarea id="prompt" name="prompt" required placeholder="anime style cute girl with cat ears"></textarea>
			  <label for="num_steps">选择生成步数 Steps (4 - 8):</label>
			  <input type="range" id="num_steps" name="num_steps" min="4" max="8" value="8" step="1">
			  <span id="num_steps_value">8</span>
			  <button type="submit">生成!</button>
			</form>
			<div id="image-container"></div>
		  </div>
		  <footer>
			<p>API endpoint: /api/generate?key=${env.KEYHOLDER}&prompt=lava%20lamp</p>
			<p>Powered by Cloudflare Workers</p>
		  </footer>
		  <script>
		  document.addEventListener('DOMContentLoaded', function () {
			const form = document.querySelector('form');
			const range = document.getElementById('num_steps');
			const valueDisplay = document.getElementById('num_steps_value');
			const imageContainer = document.getElementById('image-container');  // 用于展示生成的图像
  
			// 初始化显示
			valueDisplay.textContent = range.value;
  
			// 每次滑动时更新显示
			range.addEventListener('input', function() {
			  valueDisplay.textContent = range.value;
			});
  
			form.addEventListener('submit', async function(event) {
			  event.preventDefault(); // 防止默认的表单提交行为
  
			  // 获取用户输入的 prompt 和 num_steps
			  const prompt = document.getElementById('prompt').value.trim(); // 获取输入框中的值并去除多余空格
			  const num_steps = range.value;
  
			  // 检查 prompt 是否为空
			  if (!prompt) {
				alert('请输入有效的提示词');
				return;
			  }
  
			  // 找到按钮并显示加载状态
			  const submitButton = document.querySelector('button');
			  submitButton.innerHTML = '生成中...'; // 更改按钮文本
			  submitButton.classList.add('loading');
			  submitButton.disabled = true; // 禁用按钮，防止重复提交
  
			  try {
				// 使用 fetch 异步提交请求
				const response = await fetch(\`/api/generate?key=${env.KEYHOLDER}&prompt=\${encodeURIComponent(prompt)}&steps=\${num_steps}\`);
  
				if (response.ok) {
				  const imageBlob = await response.blob();
				  const imageURL = URL.createObjectURL(imageBlob);  // 创建图像URL
  
				  // 清空之前的图像并添加新的图像
				  imageContainer.innerHTML = '';
				  const image = document.createElement('img');
				  image.src = imageURL;
				  image.classList.add('generated-image');
  
				  imageContainer.appendChild(image);
  
				  // 将生成的图像设置为背景
				  document.body.style.backgroundImage = \`url(\${imageURL})\`; // 这里是有效的 imageURL
				} else {
				  alert('生成图像失败，请稍后再试');
				}
			  } catch (error) {
				console.error('Error generating image:', error);
				alert('生成图像时发生错误，请稍后再试');
			  } finally {
				// 恢复按钮状态
				submitButton.innerHTML = '生成!'; // 恢复按钮文本
				submitButton.classList.remove('loading'); // 移除加载状态
				submitButton.disabled = false; // 启用按钮
			  }
			});
		  });
		</script>
		</body>
		</html>
		`, { headers: { 'Content-Type': 'text/html' } });
	  }
    
	  // 处理其他请求方式（如 PUT、DELETE）
	  return new Response('Method Not Allowed', { status: 405 });
	},
  };
  