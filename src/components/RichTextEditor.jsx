import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { SlashCommand } from './SlashCommandExtension';
import {
    Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, Image as ImageIcon, Link as LinkIcon,
    AlignLeft, AlignCenter, AlignRight, Undo, Redo, Youtube as YoutubeIcon
} from 'lucide-react';

const MenuButton = ({ onClick, isActive, disabled, children, title }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('이미지 URL을 입력하세요');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addImageFromFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                editor.chain().focus().setImage({ src: reader.result }).run();
            };
            reader.readAsDataURL(file);
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL을 입력하세요', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-white rounded-t-lg sticky top-0 z-10">
            <div className="flex gap-1 border-r pr-2 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    title="실행 취소"
                >
                    <Undo size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    title="다시 실행"
                >
                    <Redo size={18} />
                </MenuButton>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="굵게"
                >
                    <Bold size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="기울임"
                >
                    <Italic size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="취소선"
                >
                    <Strikethrough size={18} />
                </MenuButton>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="제목 1"
                >
                    <Heading1 size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="제목 2"
                >
                    <Heading2 size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="제목 3"
                >
                    <Heading3 size={18} />
                </MenuButton>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="왼쪽 정렬"
                >
                    <AlignLeft size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="가운데 정렬"
                >
                    <AlignCenter size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="오른쪽 정렬"
                >
                    <AlignRight size={18} />
                </MenuButton>
            </div>

            <div className="flex gap-1 border-r pr-2 mr-2">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="글머리 기호"
                >
                    <List size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="번호 매기기"
                >
                    <ListOrdered size={18} />
                </MenuButton>
            </div>

            <div className="flex gap-1">
                <MenuButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    title="링크 삽입"
                >
                    <LinkIcon size={18} />
                </MenuButton>
                <label className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer" title="이미지 삽입">
                    <ImageIcon size={18} />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={addImageFromFile}
                        className="hidden"
                    />
                </label>
                <MenuButton
                    onClick={() => {
                        const url = window.prompt('YouTube URL을 입력하세요');
                        if (url) {
                            editor.chain().focus().setYoutubeVideo({ src: url }).run();
                        }
                    }}
                    title="YouTube 동영상 삽입"
                >
                    <YoutubeIcon size={18} />
                </MenuButton>
            </div>
        </div>
    );
};

const RichTextEditor = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Youtube.configure({
                width: '100%',
                height: 480,
                controls: true,
                nocookie: true,
            }),
            Placeholder.configure({
                placeholder: "글을 작성하세요. '/'를 입력하면 명령어 메뉴가 나타납니다.",
            }),
            SlashCommand,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px] max-w-none',
            },
            // Drag & Drop 이미지 처리
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    const fileType = file.type;

                    if (fileType.startsWith('image/')) {
                        event.preventDefault();
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const { schema } = view.state;
                            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                            const node = schema.nodes.image.create({ src: e.target.result });
                            const transaction = view.state.tr.insert(coordinates.pos, node);
                            view.dispatch(transaction);
                        };
                        reader.readAsDataURL(file);
                        return true;
                    }
                }
                return false;
            },
            // 클립보드에서 이미지 붙여넣기
            handlePaste: (view, event, slice) => {
                const items = Array.from(event.clipboardData?.items || []);
                for (const item of items) {
                    if (item.type.startsWith('image/')) {
                        event.preventDefault();
                        const file = item.getAsFile();
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: e.target.result });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            };
                            reader.readAsDataURL(file);
                        }
                        return true;
                    }
                }
                return false;
            },
        },
    });

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default RichTextEditor;

