require('dotenv').config()
import { Command } from 'commander';
import * as fs from 'fs';
import OpenAI from 'openai'
import chalk from 'chalk'
import { prompts } from './const'

const program = new Command();
program
  .version('0.1.0')
  .requiredOption('-f, --file <type>', 'OpenAPI JSON file path')
  .parse(process.argv);

const options = program.opts();


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const readOpenApiSpec = (filePath: string): any => {
  const rawData = fs.readFileSync(filePath, 'utf8');
  console.log(chalk.yellow(rawData));
  return JSON.parse(rawData);
};

const aiCompletion = async (prompt: string) => {
  console.log(chalk.blue(prompt));
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      seed: 1,
    });
    console.log(chalk.green(completion.choices[0].message.content));
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(chalk.red('Error:', error));
    return null;
  }
}

const createInterface = async (schema: string) => {
  const prompt = prompts.schema(schema);
  return await aiCompletion(prompt);
}

const createMethod = async (schema: string) => {
  const prompt = prompts.method(schema);
  return await aiCompletion(prompt);
}

const createMethodInterface = async (schema: string) => {
  const prompt = prompts.interface(schema);
  return await aiCompletion(prompt);
}

const generateInterfaces = async (spec: any): Promise<void> => {
  await deleteFile('out/interfaces.ts');

  if (!spec.components?.schemas) {
    throw new Error('No schemas found in the OpenAPI specification.');
  }

  for (const [name, schema] of Object.entries(spec.components.schemas as Record<string, any>)) {
    const typeScriptInterface = await createInterface(schema) + '\n\n';
    fs.appendFileSync('out/interfaces.ts', typeScriptInterface);
  }
};

const generateMethods = async (spec: any): Promise<void> => {
  await deleteFile('out/methods.ts');

  if (!spec.paths) {
    throw new Error('No paths found in the OpenAPI specification.');
  }

  for (const [name, schema] of Object.entries(spec.paths)) {
    const methodSchema = schema

    // Create a new object that includes the path information
    const fullObject = {
      [name]: methodSchema
    }

    const typeScriptMethod = await createMethod(fullObject as any) + '\n\n';
    fs.appendFileSync('out/methods.ts', typeScriptMethod);
  }
};

const generateMethodInterface = async (spec: any): Promise<void> => {
  await deleteFile('out/methodInterface.ts');

  if (!spec.paths) {
    throw new Error('No paths found in the OpenAPI specification.');
  }

  for (const [name, schema] of Object.entries(spec.paths)) {
    const methodSchema = schema

    // Create a new object that includes the path information
    const fullObject = {
      [name]: methodSchema
    }

    const typeScriptMethod = await createMethodInterface(fullObject as any) + '\n\n';
    fs.appendFileSync('out/methodInterface.ts', typeScriptMethod);
  }
};

const deleteFile = (filePath: string) => {
  try {
    fs.unlinkSync(filePath)
    console.log('File successfully deleted', filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}

const writeOpenApiSpec = async () => {
  const spec = readOpenApiSpec(options.file);
  await generateMethodInterface(spec);
  await generateMethods(spec);
  await generateInterfaces(spec);
  console.log('TypeScript interfaces generated successfully.');
}

writeOpenApiSpec();

