"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthTestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFullFlow = async () => {
    if (!email || !password) {
      addResult('❌ Please enter email and password');
      return;
    }

    setResults([]);
    addResult('🔍 Starting full authentication test...');
    
    try {
      // Step 1: Try to sign up
      addResult(`📝 Testing signup for: ${email}`);
      const signupResult = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      if (signupResult.error) {
        if (signupResult.error.message.includes('User already registered')) {
          addResult('✅ User already exists, proceeding to login test...');
        } else {
          addResult(`❌ Signup failed: ${signupResult.error.message}`);
          return;
        }
      } else {
        addResult(`✅ Signup successful: ${signupResult.data?.user?.email}`);
        addResult(`📧 Email confirmed: ${!!signupResult.data?.user?.email_confirmed_at}`);
        addResult(`🔑 Session created: ${!!signupResult.data?.session}`);
      }
      
      // Step 2: Try to sign in
      addResult(`🔑 Testing login for: ${email}`);
      const loginResult = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      if (loginResult.error) {
        addResult(`❌ Login failed: ${loginResult.error.message}`);
        addResult(`   Status: ${(loginResult.error as any)?.status || 'No status'}`);
      } else {
        addResult(`✅ Login successful: ${loginResult.data?.user?.email}`);
        addResult(`🔑 Session active: ${!!loginResult.data?.session}`);
        addResult(`🎉 AUTHENTICATION WORKING PERFECTLY!`);
      }
      
    } catch (error: any) {
      addResult(`❌ Test exception: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Complete Authentication Test</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Test Credentials:</h3>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter email to test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded"
              />
              <input
                type="password"
                placeholder="Enter password to test"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded"
              />
              <button 
                onClick={testFullFlow}
                className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 font-semibold"
              >
                Test Complete Flow (Signup + Login)
              </button>
              <button 
                onClick={() => setResults([])}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear Results
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded">
              <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Enter any email (e.g., test@gmail.com)</li>
                <li>• Enter any password (6+ characters)</li>
                <li>• Click test to see if signup/login works</li>
                <li>• If successful, your auth pages should work!</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Test Results:</h3>
            <div className="bg-black text-green-400 p-4 rounded h-96 overflow-y-auto text-sm font-mono">
              {results.length === 0 ? (
                <p>Enter credentials and click test...</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
