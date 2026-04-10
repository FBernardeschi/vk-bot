# 🤖 VK Bot

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-red)](LICENSE)

VK бот на TypeScript с использованием библиотеки [vk-io](https://github.com/negezor/vk-io).

## 📋 Содержание

- [Возможности](#-возможности)
- [Требования](#-требования)
- [Установка](#-установка)
- [Настройка](#-настройка)
- [Запуск](#-запуск)
- [Команды](#-команды)
- [Деплой на сервер](#-деплой-на-сервер)
- [Структура проекта](#-структура-проекта)

## ✨ Возможности

- 🎲 Случайные реакции на сообщения
- 📝 TypeScript для типобезопасности
- 🚀 Автоматический деплой одной командой
- 🔄 Авто-перезапуск при обновлениях

## 📦 Требования

- **Node.js** версии 18 или выше
- **npm** (устанавливается вместе с Node.js)
- **Git** (для клонирования репозитория)

## 🚀 Установка

### 1. Установите Node.js (если не установлен)

**Ubuntu/Debian:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
git clone https://github.com/FBernardeschi/vk-bot.git
cd vk-bot
npm install
```

Создайте файл `.env`
Заполните по примеру `.env.example`

```bash
npm run start
```