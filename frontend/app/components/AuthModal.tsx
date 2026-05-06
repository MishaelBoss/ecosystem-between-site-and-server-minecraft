'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Portal from './Portal';
import { Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Props {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitch: (m: 'login' | 'register') => void;
}

export default function AuthModal({ mode, onClose, onSwitch }: Props) {
  const { login, register: registerUser, isLoading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<IUserRegister>();

  const onSubmit = async (data: IUserLogin | IUserRegister) => {
    setError('');
    try {
      if (mode === 'login') {
        await login(data as IUserLogin);
      } else {
        await registerUser(data as IUserRegister);
      }
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Произошла ошибка. Попробуйте снова.');
    }
  };

  return (
    <Portal>
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{
        backgroundColor: '#111111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '36px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        animation: 'fadeInUp 0.25s ease',
      }}>
        <button
          type='button'
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none',
            color: '#a0a0a0', cursor: 'pointer',
            display: 'flex', padding: '4px',
            borderRadius: '6px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#a0a0a0')}
          aria-label="Закрыть модальное окно"
        >
          <X size={18} />
        </button>

        <h2 style={{
          fontSize: '24px', fontWeight: 700, marginBottom: '6px',
          background: 'linear-gradient(90deg, #ffffff, #e0195a)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {mode === 'login' ? 'Авторизация' : 'Регистрация'}
        </h2>
        <p style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '28px' }}>
          {mode === 'login' ? 'Войдите в личный кабинет' : 'Создайте аккаунт для игры'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <Field
              icon={<User size={15} />}
              placeholder="Имя пользователя"
              type="text"
              error={errors.username?.message}
              {...register('username', { required: 'Введите имя пользователя' })}
            />
          )}

          <Field
            icon={<Mail size={15} />}
            placeholder="Email"
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Введите email',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Некорректный email' },
            })}
          />

          <Field
            icon={<Lock size={15} />}
            placeholder="Пароль"
            type={showPass ? 'text' : 'password'}
            error={errors.password?.message}
            suffix={
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{ background: 'none', border: 'none', color: '#a0a0a0', cursor: 'pointer', display: 'flex', padding: '0' }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            {...register('password', {
              required: 'Введите пароль',
              minLength: { value: 6, message: 'Минимум 6 символов' },
            })}
          />

          {mode === 'register' && (
            <Field
              icon={<Lock size={15} />}
              placeholder="Повторите пароль"
              type="password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { required: 'Повторите пароль' })}
            />
          )}

          {error && (
            <p style={{ color: '#e0195a', fontSize: '13px', margin: '0' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '4px',
              padding: '13px',
              backgroundColor: isLoading ? '#9b1240' : '#e0195a',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#c41450'; }}
            onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#e0195a'; }}
            aria-label="Подверждение"
          >
            {isLoading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={{ color: '#a0a0a0', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            type='button'
            onClick={() => onSwitch(mode === 'login' ? 'register' : 'login')}
            style={{
              background: 'none', border: 'none',
              color: '#e0195a', cursor: 'pointer',
              fontSize: '13px', textDecoration: 'underline', padding: 0,
            }}
            aria-label="Выбор авторизации"
          >
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
    </Portal>
  );
}

import { forwardRef } from 'react';
import { IUserLogin, IUserRegister } from '../types/user.interface';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  error?: string;
  suffix?: React.ReactNode;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ icon, error, suffix, ...inputProps }, ref) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        backgroundColor: '#161616',
        border: `1px solid ${error ? '#e0195a66' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '10px',
        padding: '0 14px',
        transition: 'border-color 0.2s',
      }}
      onFocusCapture={e => (e.currentTarget.style.borderColor = error ? '#e0195a' : 'rgba(255,255,255,0.2)')}
      onBlurCapture={e => (e.currentTarget.style.borderColor = error ? '#e0195a66' : 'rgba(255,255,255,0.08)')}
      >
        <span style={{ color: '#a0a0a0', display: 'flex', flexShrink: 0 }}>{icon}</span>
        <input
          ref={ref}
          {...inputProps}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '14px',
            padding: '13px 0',
          }}
        />
        {suffix}
      </div>
      {error && <p style={{ color: '#e0195a', fontSize: '12px', margin: '0 4px' }}>{error}</p>}
    </div>
  )
);
Field.displayName = 'Field';