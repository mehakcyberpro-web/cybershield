import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App.jsx';
import './styles.css';

const store = configureStore({ reducer: { ui: (state = { activeView: 'Overview' }, action) => action.type === 'ui/navigate' ? { ...state, activeView: action.payload } : state } });
createRoot(document.getElementById('root')).render(<Provider store={store}><App /></Provider>);
