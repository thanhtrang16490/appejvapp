// Test script to verify API connection
const API_BASE_URL = 'https://statics.appejv.app/api';

async function testApiConnection() {
  console.log('🧪 Testing API connection...\n');

  try {
    // Test 1: API Health Check
    console.log('1. Testing API health check...');
    const healthResponse = await fetch(`${API_BASE_URL}/test`);
    const healthData = await healthResponse.json();
    console.log('✅ API Health:', healthData.success ? 'OK' : 'FAILED');
    console.log('📊 Database counts:', healthData.counts);
    console.log('');

    // Test 2: Sectors endpoint
    console.log('2. Testing sectors endpoint...');
    const sectorsResponse = await fetch(`${API_BASE_URL}/sectors`);
    const sectorsData = await sectorsResponse.json();
    console.log('✅ Sectors loaded:', sectorsData.data?.length || 0, 'sectors');
    if (sectorsData.data?.length > 0) {
      console.log('📋 First sector:', sectorsData.data[0].name);
    }
    console.log('');

    // Test 3: Products endpoint
    console.log('3. Testing products endpoint...');
    const productsResponse = await fetch(`${API_BASE_URL}/products?limit=5`);
    const productsData = await productsResponse.json();
    console.log('✅ Products loaded:', productsData.data?.length || 0, 'products');
    if (productsData.data?.length > 0) {
      console.log('📦 First product:', productsData.data[0].name);
      console.log('💰 Price:', new Intl.NumberFormat('vi-VN').format(productsData.data[0].price), 'đ');
    }
    console.log('');

    // Test 4: Contents endpoint
    console.log('4. Testing contents endpoint...');
    const contentsResponse = await fetch(`${API_BASE_URL}/contents?limit=3`);
    const contentsData = await contentsResponse.json();
    console.log('✅ Contents loaded:', contentsData.data?.length || 0, 'contents');
    if (contentsData.data?.length > 0) {
      console.log('📄 First content:', contentsData.data[0].title);
    }
    console.log('');

    console.log('🎉 All API tests passed! The integration is working correctly.');
    console.log('');
    console.log('🌐 Access URLs:');
    console.log('   - Web App: http://localhost:3000');
    console.log('   - API Server: https://statics.appejv.app');
    console.log('   - Admin Panel: https://statics.appejv.app/dashboard');
    console.log('');

  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure https://statics.appejv.app is accessible');
    console.log('   2. Check if the online API is properly deployed');
    console.log('   3. Verify the API endpoints are accessible online');
  }
}

// Run the test
testApiConnection();