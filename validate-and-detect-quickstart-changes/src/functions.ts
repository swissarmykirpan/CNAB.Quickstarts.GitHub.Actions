import * as core from '@actions/core';
import jp from "jsonpath";
import axios from 'axios';

export async function getFiles(trigger: string, repoName: string, sourceVersion?: string, prNumber?: number) : Promise<string[]> { 
    try {
        let files:string[];

        if (trigger == "push") {
            let commitUri = `https://api.github.com/repos/${repoName}/commits/${sourceVersion}`;
    
            core.info(`Merge Commit uri: ${commitUri}`);
    
            let response = await axios.get(commitUri);
            let data = await response.data;
    
            files = jp.query(data, '$..filename');
        }
        else if (trigger == "pull_request") {
            let prUri = `https://api.github.com/repos/${repoName}/pulls/${prNumber}/files`;
    
            core.info(`PR uri: ${prUri}`);
    
            let response = await axios.get(prUri);
            let data = await response.data;
    
            files = jp.query(data, '$..filename');
        }
        else {
            throw `Unsupported trigger type: ${trigger}`;
        }
    
        core.info("Files changed:");
        files.forEach(file => {
            core.info(file);
        });
    
        return files;
    } catch (error) {
        core.setFailed(error.message);
    }
}