"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ConfigTestPage() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const runTests = async () => {
      addResult('🔍 Starting Supabase configuration tests...');
      
      // Test 1: Environment Variables
      addResult(`📝 SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
      addResult(`📝 ANON_KEY length: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length}`);
      addResult(`📝 ANON_KEY prefix: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30)}...`);
      
      // Test 2: Basic connection
      try {
        addResult('🔗 Testing basic Supabase connection...');
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          addResult(`❌ Connection test failed: ${error.message}`);
        } else {
          addResult('✅ Basic connection successful');
        }
      } catch (e: any) {
        addResult(`❌ Connection exception: ${e.message}`);
      }
      
      // Test 3: Test signup with simple data
      try {
        addResult('📝 Testing signup API call...');
        const testEmail = `test_${Date.now()}@example.com`;
        const result = await supabase.auth.signUp({
          email: testEmail,
          password: 'testpass123',
        });
        
        if (result.error) {
          addResult(`❌ Signup test error: ${result.error.message}`);
          addResult(`   Status: ${(result.error as any)?.status || 'No status'}`);
        } else {
          addResult(`✅ Signup test successful: ${result.data?.user?.email}`);
          addResult(`   Session: ${!!result.data?.session}`);
          
          // Now test login with the same credentials
          addResult('🔑 Testing login with the same credentials...');
          const loginResult = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: 'testpass123',
          });
          
          if (loginResult.error) {
            addResult(`❌ Login test error: ${loginResult.error.message}`);
            addResult(`   Status: ${(loginResult.error as any)?.status || 'No status'}`);
          } else {
            addResult(`✅ Login test successful: ${loginResult.data?.user?.email}`);
          }
        }
      } catch (e: any) {
        addResult(`❌ Auth test exception: ${e.message}`);
        addResult(`   Full error: ${JSON.stringify(e, null, 2)}`);
      }
    };

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Supabase Configuration Test</h1>
        
        <div className="bg-black text-green-400 p-4 rounded h-96 overflow-y-auto text-sm font-mono">
          {results.length === 0 ? (
            <p>Running tests...</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="mb-1">{result}</div>
            ))
          )}
        </div>
        
        <div className="mt-4 space-x-4">
          <button 
            onClick={() => setResults([])}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Results
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Rerun Tests
          </button>
        </div>
      </div>
    </div>
  );
}
