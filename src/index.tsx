import { StrictMode, useState, useEffect, useRef } from 'react';
import { createRoot } from "react-dom/client";
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
	const ref = useRef<any>();
	const [input, setInput] = useState('');
	const [code, setCode] = useState('');

	const startService = async () => {
		ref.current = await esbuild.startService({
			worker: true,
			wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
		});
	};

	useEffect(() => {
		startService();
	}, []);

	const onClick = async () => {
		if (!ref.current) {
			return;
		}

		const result = await ref.current.build({
			entryPoints: ['index.js'],
			bundle: true,
			write: false,
			plugins: [
				unpkgPathPlugin(),
				fetchPlugin(input)
			],
			define: {
				'process.env.NODE.ENV': '"production"',
				global: 'window'
			},
		});

		setCode(result.outputFiles[0].text);
	};

	const html = `
	<script>
	  ${code}
	</script>
	`;

	return (
		<div>
		<textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
		<div>
			<button onClick={onClick}>Submit</button>
		</div>
			<pre>{code}</pre>
			<iframe sandbox='allow-scripts' title='html' srcDoc={html} />
		</div>
	);
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
