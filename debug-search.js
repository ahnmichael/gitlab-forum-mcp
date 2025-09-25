#!/usr/bin/env node

// Debug script to test GitLab forum search endpoint directly
import fetch from 'node-fetch';

const BASE_URL = 'https://forum.gitlab.com';

async function testSearchEndpoint(query, expanded = true) {
  console.log(`\n=== Testing search: "${query}" ===`);
  
  const params = new URLSearchParams();
  if (expanded) params.set('expanded', 'true');
  params.set('q', query);
  
  const url = `${BASE_URL}/search.json?${params.toString()}`;
  console.log(`URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Discourse-MCP/0.x (+https://github.com/discourse-mcp)'
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    
    const data = await response.json();
    console.log('Response keys:', Object.keys(data));
    console.log('Topics found:', data.topics?.length || 0);
    console.log('Posts found:', data.posts?.length || 0);
    
    if (data.topics?.length > 0) {
      console.log('First topic:', {
        id: data.topics[0].id,
        title: data.topics[0].title,
        slug: data.topics[0].slug
      });
    }
    
    if (data.posts?.length > 0) {
      console.log('First post:', {
        id: data.posts[0].id,
        topic_id: data.posts[0].topic_id,
        excerpt: data.posts[0].excerpt?.substring(0, 100)
      });
    }
    
    console.log('Full response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testFilterEndpoint(query) {
  console.log(`\n=== Testing filter: "${query}" ===`);
  
  const params = new URLSearchParams();
  params.set('q', query);
  
  const url = `${BASE_URL}/filter.json?${params.toString()}`;
  console.log(`URL: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Discourse-MCP/0.x (+https://github.com/discourse-mcp)'
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    const data = await response.json();
    
    console.log('Response keys:', Object.keys(data));
    const topics = data.topic_list?.topics || data.topics || [];
    console.log('Topics found:', topics.length);
    
    if (topics.length > 0) {
      console.log('First topic:', {
        id: topics[0].id,
        title: topics[0].title,
        slug: topics[0].slug
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main() {
  console.log('=== GitLab Forum Search Debug ===');
  
  // Test searches that should return results
  await testSearchEndpoint('docker');
  await testSearchEndpoint('CI CD pipeline');
  await testSearchEndpoint('category:help order:latest-post docker'); // With default prefix
  await testSearchEndpoint('docker', false); // Without expanded
  
  // Test filter for comparison
  await testFilterEndpoint('category:"GitLab CI/CD" order:activity');
  await testFilterEndpoint('docker order:latest-post');
}

main().catch(console.error);
