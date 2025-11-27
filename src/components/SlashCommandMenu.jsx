import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
    Heading1, Heading2, Heading3, List, ListOrdered,
    Image as ImageIcon, Youtube, Type
} from 'lucide-react';

const SLASH_COMMANDS = [
    {
        id: 'heading1',
        title: '제목 1',
        description: '큰 제목',
        icon: Heading1,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
        }
    },
    {
        id: 'heading2',
        title: '제목 2',
        description: '중간 제목',
        icon: Heading2,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
        }
    },
    {
        id: 'heading3',
        title: '제목 3',
        description: '작은 제목',
        icon: Heading3,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
        }
    },
    {
        id: 'bullet',
        title: '글머리 기호 목록',
        description: '간단한 목록 만들기',
        icon: List,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        }
    },
    {
        id: 'number',
        title: '번호 매기기 목록',
        description: '순서가 있는 목록',
        icon: ListOrdered,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        }
    },
    {
        id: 'image',
        title: '이미지',
        description: '이미지 업로드',
        icon: ImageIcon,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();
            // Trigger file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        editor.chain().focus().setImage({ src: reader.result }).run();
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        }
    },
    {
        id: 'youtube',
        title: 'YouTube',
        description: 'YouTube 동영상 삽입',
        icon: Youtube,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();
            const url = window.prompt('YouTube URL을 입력하세요');
            if (url) {
                editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }
        }
    }
];

const SlashCommandMenu = forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS);

    useEffect(() => {
        if (props.query) {
            const filtered = SLASH_COMMANDS.filter(cmd =>
                cmd.title.toLowerCase().includes(props.query.toLowerCase()) ||
                cmd.description.toLowerCase().includes(props.query.toLowerCase())
            );
            setFilteredCommands(filtered);
            setSelectedIndex(0);
        } else {
            setFilteredCommands(SLASH_COMMANDS);
        }
    }, [props.query]);

    const selectItem = (index) => {
        const command = filteredCommands[index];
        if (command) {
            command.command(props);
        }
    };

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + filteredCommands.length - 1) % filteredCommands.length);
                return true;
            }

            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % filteredCommands.length);
                return true;
            }

            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }

            return false;
        }
    }));

    if (filteredCommands.length === 0) {
        return (
            <div className="slash-menu">
                <div className="px-4 py-2 text-gray-500 text-sm">명령어를 찾을 수 없습니다</div>
            </div>
        );
    }

    return (
        <div className="slash-menu">
            {filteredCommands.map((command, index) => {
                const Icon = command.icon;
                return (
                    <button
                        key={command.id}
                        className={`slash-menu-item ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => selectItem(index)}
                        type="button"
                    >
                        <div className="slash-menu-item-icon">
                            <Icon size={18} />
                        </div>
                        <div className="slash-menu-item-content">
                            <div className="slash-menu-item-title">{command.title}</div>
                            <div className="slash-menu-item-description">{command.description}</div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
});

SlashCommandMenu.displayName = 'SlashCommandMenu';

export default SlashCommandMenu;
