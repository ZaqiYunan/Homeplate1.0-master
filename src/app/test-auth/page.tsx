"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestAuthPage() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        addResult('Testing Supabase connection...');
        
        // Test basic connection
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          addResult(`❌ Connection Error: ${error.message}`);
          setConnectionStatus('Failed');
          return;
        }
        
        addResult('✅ Supabase connection successful');
        setConnectionStatus('Connected');
        
        // Test if we can access auth users (should work)
        addResult('Testing auth access...');
        
      } catch (connectionError: any) {
        addResult(`❌ Connection Exception: ${connectionError.message}`);
        setConnectionStatus('Failed');
      }
    };

    testConnection();
  }, []);

  const testSpecificLogin = async () => {
    if (!testEmail || !testPassword) {
      addResult('❌ Please enter email and password to test');
      return;
    }

    addResult(`🔍 Testing login for: ${testEmail}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (error) {
        addResult(`❌ Login Error: ${error.message}`);
        
        // Check if it's a confirmation issue
        if (error.message.includes('Invalid login credentials')) {
          addResult('💡 This could mean: wrong password, wrong email, or email not confirmed');
          
          // Try to check if user exists (this might not work due to RLS)
          addResult('🔍 Checking if this email exists in the system...');
        }
      } else {
        addResult(`✅ Login Success! User: ${data.user?.email}`);
        addResult(`✅ Session created: ${!!data.session}`);
        addResult(`✅ Email confirmed: ${!!data.user?.email_confirmed_at}`);
      }
    } catch (loginError: any) {
      addResult(`❌ Login Exception: ${loginError.message}`);
    }
  };

  const testSignupFlow = async () => {
    const randomEmail = `test_${Date.now()}@example.com`;
    const password = 'testpass123';
    
    addResult(`🔍 Testing signup flow with: ${randomEmail}`);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: randomEmail,
        password: password,
      });
      
      if (error) {
        addResult(`❌ Signup Error: ${error.message}`);
      } else {
        addResult(`✅ Signup Success! User created: ${data.user?.email}`);
        addResult(`📧 Email confirmed: ${!!data.user?.email_confirmed_at}`);
        addResult(`🔑 Session created: ${!!data.session}`);
        
        if (!data.session) {
          addResult('💡 No session = Email confirmation required before login');
        }
      }
    } catch (signupError: any) {
      addResult(`❌ Signup Exception: ${signupError.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Supabase Authentication Debugger</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Connection Status:</h3>
            <p className={`text-lg mb-4 ${connectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
              {connectionStatus}
            </p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Configuration:</h3>
              <div className="text-sm bg-gray-50 p-3 rounded">
                <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30)}...</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={testSignupFlow}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test Signup Flow
              </button>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Test Specific Login:</h4>
                <input
                  type="email"
                  placeholder="Enter email to test"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="password"
                  placeholder="Enter password to test"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <button 
                  onClick={testSpecificLogin}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Test This Login
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Test Results:</h3>
            <div className="bg-black text-green-400 p-4 rounded h-96 overflow-y-auto text-sm font-mono">
              {testResults.length === 0 ? (
                <p>No tests run yet...</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))
              )}
            </div>
            <button 
              onClick={() => setTestResults([])}
              className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
