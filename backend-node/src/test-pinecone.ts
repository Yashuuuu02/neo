
import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import embeddingService from './services/embedding.service';

dotenv.config();

async function testPinecone() {
    console.log('=== Pinecone Connectivity Test ===\n');

    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX || 'neochatbot';

    if (!apiKey) {
        console.error('PINECONE_API_KEY not set!');
        return;
    }

    try {
        console.log('1. Initializing Pinecone client...');
        const pc = new Pinecone({ apiKey });

        console.log('2. Listing indexes (Control Plane Check)...');
        const list = await pc.listIndexes();
        console.log('Indexes found:', list.indexes?.map(i => i.name) || []);

        const indexModel = list.indexes?.find(i => i.name === indexName);
        if (indexModel) {
            console.log(`Index '${indexName}' status:`, indexModel.status);
            console.log(`Index host:`, indexModel.host);
        } else {
            console.warn(`Warning: Index '${indexName}' not found in list!`);
        }

        console.log(`\n3. Connecting to index '${indexName}'...`);
        const index = pc.index(indexName);

        // Try getting stats
        // console.log('Fetching stats...');
        // const stats = await index.describeIndexStats();
        // console.log('Stats:', stats);

        console.log('\n4. Generating Embedding for query...');
        await embeddingService.init();
        const queryEmbedding = await embeddingService.generateEmbedding('What is Cogneoverse?');
        console.log('Query embedding generated (dim: ' + queryEmbedding.length + ')');

        console.log('\n5. Querying index...');
        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: 3,
            includeMetadata: true,
        });

        console.log('Query success!');
        console.log('Matches:', queryResponse.matches.length);
        queryResponse.matches.forEach(m => {
            console.log(`- Score: ${m.score?.toFixed(4)} | ID: ${m.id}`);
            if (m.metadata && m.metadata.text) {
                console.log(`  Text: ${String(m.metadata.text).substring(0, 50)}...`);
            }
        });

    } catch (error: any) {
        console.error('\n❌ ERROR:', error);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
    }
}

testPinecone();
