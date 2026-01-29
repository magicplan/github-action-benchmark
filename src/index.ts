import * as core from '@actions/core';
import { configFromJobInput } from './config';
import { extractResult } from './extract';
import { writeBenchmark } from './write';

async function main() {
    const config = await configFromJobInput();
    core.debug(`Config extracted from job: ${config}`);

    if (config.repoDir) {
        core.info(`Changing working directory to: ${config.repoDir}`);
        try {
            process.chdir(config.repoDir);
        } catch (err) {
            throw new Error(
                `Failed to change working directory to '${config.repoDir}'. ` +
                    `Please ensure the directory exists and is accessible. ` +
                    `Original error: ${err instanceof Error ? err.message : err}`,
            );
        }
    }

    const bench = await extractResult(config);
    core.debug(`Benchmark result was extracted: ${bench}`);

    await writeBenchmark(bench, config);

    console.log('github-action-benchmark was run successfully!', '\nData:', bench);
}

main().catch((e) => core.setFailed(e.message));
