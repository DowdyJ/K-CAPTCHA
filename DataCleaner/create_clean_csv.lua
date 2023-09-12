---@diagnostic disable: cast-local-type

-- create csv with entries like this:
-- PREVIOUS_KEY_CODE, KEY_CODE, IS_OVERLAPPING_WITH_PREVIOUS, DELAY_TO_PRESS, TIME_HELD
-- 56, 31, 1, 300, 40

local data_keys = {}
data_keys.PARTICIPANT_ID = 1
data_keys.TEST_SECTION_ID = 2
data_keys.SENTENCE = 3
data_keys.USER_INPUT = 4
data_keys.KEYSTROKE_ID = 5
data_keys.PRESS_TIME = 6
data_keys.RELEASE_TIME = 7
data_keys.LETTER = 8
data_keys.KEYCODE = 9


local function get_txt_file_names_in_raw_directory()
    local output = io.popen("ls -a ../Data/raw/")

    if output == nil then return end

    local filenames = {}

    for filename in output:lines() do
        if string.find(filename, ".*%.txt$") ~= nil then
            table.insert(filenames, filename)
        end
    end

    output:close()

    return filenames
end

local function create_result_file()
    io.popen("touch ../Data/processed/result.csv")
    local result_file = io.open("../Data/processed/result.csv", "w+")
    
    if result_file == nil then
        return nil
    end

    return result_file
end

local function split(input_string, delimeter)
    local results = {}

    local start_index = 0
    local end_index = 1

    repeat

        start_index = start_index + 1
        start_index, end_index = string.find(input_string, "[^" .. delimeter .."]*", start_index)

        if start_index == nil or end_index == nil then 
            break 
        end

        if end_index < start_index then
            table.insert(results, "")
            end_index = start_index
        else
            local substr = string.sub(input_string, start_index, end_index)
            table.insert(results, substr)
        end

        start_index = string.find(input_string, delimeter, end_index)

    until start_index == nil

    return results
end

local function get_file_lines(filename)
    local file_lines = {}

    local data_file = io.open(filename, "r")
    if data_file == nil then return nil end
    for line in data_file:lines() do
        table.insert(file_lines, line)
    end

    data_file:close()


    return file_lines
end


---comment
---@param file_handle file*
---@param results table
local function write_participants_result_to_file(file_handle, results)
    
    -- {current_character_code, previous_character_code, time_held, time_since_key_press, is_overlapping}
    local key_delay_total, key_count, key_delay_avg = 0, 0, 0
    for _, row in ipairs(results) do
        key_delay_total = key_delay_total + row[4]
        key_count = key_count + 1
    end

    key_delay_avg = math.floor(key_delay_total / key_count)
    for _, row in ipairs(results) do

        file_handle:write(row[1] .. "," .. row[2] .. "," .. row[3] .. "," .. row[4] .. "," .. row[5] .. "," .. key_delay_avg .. "\n")
    end

end




local function main()
    local filenames = get_txt_file_names_in_raw_directory()
    if filenames == nil then print("Failed to get filenames"); return end
    
    local result_file = create_result_file()
    if result_file == nil then print("Failed to create result file"); return end
    
    local total_number_of_files = #filenames
    local max_tries = 99999
    for i, filename in ipairs(filenames) do repeat

        print("[ ".. math.floor(100 * i / total_number_of_files) .."% ] Processing file " .. filename .. " (" .. i .. " / " .. total_number_of_files .. ")")

        local file_lines = get_file_lines("../Data/raw/" .. filename)
        if file_lines == nil then print("Failed to load file with filename: " .. filename); break end
    
    
        -- Create data entry for clean CSV
        local previous_character_code, current_character_code, is_overlapping, time_held, time_since_key_press
        local previous_line, current_line
    
        
        local participants_results = {}
    
        for index, line in ipairs(file_lines) do repeat
            if index == 1 then
                break    
            end
            current_line = split(line, "\t")
    
            if previous_line ~= nil and current_line[data_keys.TEST_SECTION_ID] ~= previous_line[data_keys.TEST_SECTION_ID] then
                previous_line = nil
                write_participants_result_to_file(result_file, participants_results)
                participants_results = {}
            end
    
            if previous_line ==  nil then
                previous_character_code = "0"
                is_overlapping = "0"
                time_since_key_press = "-1"
            else
                previous_character_code = previous_line[data_keys.KEYCODE]
                is_overlapping = tonumber(previous_line[data_keys.RELEASE_TIME]) > tonumber(current_line[data_keys.PRESS_TIME]) and "1" or "0"
                time_since_key_press = tonumber(current_line[data_keys.PRESS_TIME]) - tonumber(previous_line[data_keys.PRESS_TIME])
            end
    
            current_character_code = current_line[data_keys.KEYCODE]
            time_held = tonumber(current_line[data_keys.RELEASE_TIME]) - tonumber(current_line[data_keys.PRESS_TIME])
    
            table.insert(participants_results, {current_character_code, previous_character_code, time_held, time_since_key_press, is_overlapping})
    
            previous_line = current_line
        until true end
    
        write_participants_result_to_file(result_file, participants_results)
    
    until true end
    
    result_file:close()
    

end

-- local good_one = split("100045	1091643	A bad thing has been turned into a good thing and.	A bad thing has been turned into a good thing and.	51922976	1473275800436	1473275800856	SHIFT	16", "\t")
-- local bad_one = split("100045	1091643	A bad thing has been turned into a good thing and.	A bad thing has been turned into a good thing and.	51922981	1473275800790	1473275800870		65", "\t")

-- for index, value in ipairs(good_one) do
--     print("VALUE I: " .. index .. " | VALUE: " .. value)
-- end


-- for index, value in ipairs(bad_one) do
--     print("VALUE I: " .. index .. " | VALUE: " .. value)
-- end

main()